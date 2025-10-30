import { z } from 'zod/v4';
import { customerFormSchema, shippingFormSchema, paymentFormSchema, reviewFormSchema } from '@/schemas';
import { storage, STORAGE_KEYS, StorageException, StorageError } from './localStorage';
import type { CheckoutData } from '$lib/types/checkout';

export const checkoutDataSchema = z
    .object({
        customer: customerFormSchema.optional(),
        shipping: shippingFormSchema.optional(),
        payment: paymentFormSchema.optional(),
        review: reviewFormSchema.optional(),
        stepProgress: z.array(z.enum(['customer', 'shipping', 'payment', 'review'])).default([]),
        lastUpdated: z.number().default(() => Date.now()),
        sessionId: z.string().optional(),
    })
    .default(() => ({
        stepProgress: [],
        lastUpdated: Date.now(),
    }));

export type EnhancedCheckoutData = z.infer<typeof checkoutDataSchema>;

export enum RecoveryStrategy {
    RESET_ALL = 'reset_all',
    USE_DEFAULTS = 'use_defaults',
}

export interface CheckoutStorageOptions {
    validateOnGet?: boolean;
    recoveryStrategy?: RecoveryStrategy;
    onError?: (error: StorageException, data?: Partial<CheckoutData>) => void;
    onRecovery?: (strategy: RecoveryStrategy, recoveredData: EnhancedCheckoutData) => void;
}

export class CheckoutStorage {
    private static defaultOptions: Required<CheckoutStorageOptions> = {
        validateOnGet: true,
        recoveryStrategy: RecoveryStrategy.USE_DEFAULTS,
        onError: (error) => console.error('Checkout storage error:', error),
        onRecovery: (strategy, data) => console.info('Checkout data recovered using:', strategy, data),
    };

    static getCheckoutData(options: CheckoutStorageOptions = {}): EnhancedCheckoutData {
        const opts = { ...this.defaultOptions, ...options };

        try {
            const data = storage.get(STORAGE_KEYS.CHECKOUT_DATA, checkoutDataSchema);

            if (data === null) {
                const defaultData = checkoutDataSchema.parse({});
                if (opts.onRecovery) {
                    opts.onRecovery(RecoveryStrategy.USE_DEFAULTS, defaultData);
                }
                return defaultData;
            }

            if (opts.validateOnGet) {
                this.validateDataConsistency(data);
            }

            return data;
        } catch (error) {
            if (opts.onError) {
                opts.onError(error as StorageException);
            }

            return this.recoverData(opts.recoveryStrategy, error as StorageException, opts.onRecovery);
        }
    }

    static setCheckoutData(data: Partial<CheckoutData>, options: CheckoutStorageOptions = {}): boolean {
        const opts = { ...this.defaultOptions, ...options };

        try {
            const currentData = this.getCheckoutData({ ...opts, validateOnGet: false });
            const updatedData: EnhancedCheckoutData = {
                ...currentData,
                ...data,
                lastUpdated: Date.now(),
            };

            if (data.customer && !currentData.stepProgress.includes('customer')) {
                updatedData.stepProgress = [...currentData.stepProgress, 'customer'];
            }
            if (data.shipping && !currentData.stepProgress.includes('shipping')) {
                updatedData.stepProgress = [...currentData.stepProgress, 'shipping'];
            }
            if (data.payment && !currentData.stepProgress.includes('payment')) {
                updatedData.stepProgress = [...currentData.stepProgress, 'payment'];
            }
            if (data.review && !currentData.stepProgress.includes('review')) {
                updatedData.stepProgress = [...currentData.stepProgress, 'review'];
            }

            const validatedData = checkoutDataSchema.parse(updatedData);

            return storage.set(STORAGE_KEYS.CHECKOUT_DATA, validatedData, checkoutDataSchema);
        } catch (error) {
            if (opts.onError) {
                opts.onError(error as StorageException, data);
            }
            return false;
        }
    }

    static updateStep<T extends keyof CheckoutData>(
        step: T,
        stepData: CheckoutData[T],
        options: CheckoutStorageOptions = {},
    ): boolean {
        return this.setCheckoutData({ [step]: stepData } as Partial<CheckoutData>, options);
    }

    static getStepData<T extends keyof CheckoutData>(
        step: T,
        options: CheckoutStorageOptions = {},
    ): CheckoutData[T] | null {
        const data = this.getCheckoutData(options);
        return data[step] || null;
    }

    static isStepCompleted(step: keyof CheckoutData): boolean {
        try {
            const data = this.getCheckoutData();
            return data.stepProgress.includes(step as any);
        } catch {
            return false;
        }
    }

    static getProgress(): number {
        try {
            const data = this.getCheckoutData();
            const totalSteps = 4;
            return (data.stepProgress.length / totalSteps) * 100;
        } catch {
            return 0;
        }
    }

    static clearCheckoutData(): void {
        storage.remove(STORAGE_KEYS.CHECKOUT_DATA);
    }

    static validateForSubmission(): { valid: boolean; missingSteps: string[]; errors: string[] } {
        try {
            const data = this.getCheckoutData();
            const missingSteps: string[] = [];
            const errors: string[] = [];

            if (!data.customer) {
                missingSteps.push('customer');
            } else {
                const customerValidation = customerFormSchema.safeParse(data.customer);
                if (!customerValidation.success) {
                    errors.push(`Customer data invalid: ${customerValidation.error.message}`);
                }
            }

            if (!data.shipping) {
                missingSteps.push('shipping');
            } else {
                const shippingValidation = shippingFormSchema.safeParse(data.shipping);
                if (!shippingValidation.success) {
                    errors.push(`Shipping data invalid: ${shippingValidation.error.message}`);
                }
            }

            if (!data.payment) {
                missingSteps.push('payment');
            } else {
                const paymentValidation = paymentFormSchema.safeParse(data.payment);
                if (!paymentValidation.success) {
                    errors.push(`Payment data invalid: ${paymentValidation.error.message}`);
                }
            }

            if (!data.review) {
                missingSteps.push('review');
            } else {
                const reviewValidation = reviewFormSchema.safeParse(data.review);
                if (!reviewValidation.success) {
                    errors.push(`Review data invalid: ${reviewValidation.error.message}`);
                }
            }

            return {
                valid: missingSteps.length === 0 && errors.length === 0,
                missingSteps,
                errors,
            };
        } catch (error) {
            return {
                valid: false,
                missingSteps: ['customer', 'shipping', 'payment', 'review'],
                errors: [`Storage error: ${error}`],
            };
        }
    }

    static exportData(): { data: EnhancedCheckoutData | null; metadata: any } {
        const storageInfo = storage.getInfo();
        const healthCheck = storage.healthCheck();

        try {
            const data = this.getCheckoutData();
            return {
                data,
                metadata: {
                    timestamp: new Date().toISOString(),
                    storageInfo,
                    healthCheck,
                    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
                },
            };
        } catch (error) {
            return {
                data: null,
                metadata: {
                    timestamp: new Date().toISOString(),
                    error: String(error),
                    storageInfo,
                    healthCheck,
                    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
                },
            };
        }
    }

    private static recoverData(
        strategy: RecoveryStrategy,
        _error: StorageException,
        onRecovery?: (strategy: RecoveryStrategy, recoveredData: EnhancedCheckoutData) => void,
    ): EnhancedCheckoutData {
        let recoveredData: EnhancedCheckoutData;

        switch (strategy) {
            case RecoveryStrategy.RESET_ALL:
                storage.remove(STORAGE_KEYS.CHECKOUT_DATA);
                recoveredData = checkoutDataSchema.parse({});
                break;

            case RecoveryStrategy.USE_DEFAULTS:
            default:
                recoveredData = checkoutDataSchema.parse({});
                break;
        }

        if (onRecovery) {
            onRecovery(strategy, recoveredData);
        }

        return recoveredData;
    }

    private static validateDataConsistency(data: EnhancedCheckoutData): void {
        if (data.shipping?.shippingMethod) {
            const validMethods = ['standard', 'express', 'overnight'];
            if (!validMethods.includes(data.shipping.shippingMethod)) {
                throw new StorageException(
                    StorageError.VALIDATION_ERROR,
                    `Invalid shipping method: ${data.shipping.shippingMethod}`,
                );
            }
        }

        if (data.payment?.paymentMethod && data.payment.paymentMethod !== 'cash_on_delivery') {
            throw new StorageException(
                StorageError.VALIDATION_ERROR,
                `Invalid payment method: ${data.payment.paymentMethod}`,
            );
        }

        if (data.lastUpdated && Date.now() - data.lastUpdated > 24 * 60 * 60 * 1000) {
            console.warn('Checkout data is older than 24 hours, consider refreshing');
        }
    }
}

export const checkoutStorage = {
    get: (options?: CheckoutStorageOptions) => CheckoutStorage.getCheckoutData(options),
    set: (data: Partial<CheckoutData>, options?: CheckoutStorageOptions) =>
        CheckoutStorage.setCheckoutData(data, options),
    updateStep: <T extends keyof CheckoutData>(step: T, stepData: CheckoutData[T], options?: CheckoutStorageOptions) =>
        CheckoutStorage.updateStep(step, stepData, options),
    getStep: <T extends keyof CheckoutData>(step: T, options?: CheckoutStorageOptions) =>
        CheckoutStorage.getStepData(step, options),
    isCompleted: (step: keyof CheckoutData) => CheckoutStorage.isStepCompleted(step),
    getProgress: () => CheckoutStorage.getProgress(),
    clear: () => CheckoutStorage.clearCheckoutData(),
    validate: () => CheckoutStorage.validateForSubmission(),
    export: () => CheckoutStorage.exportData(),
};
