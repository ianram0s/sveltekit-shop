import { redirect } from '@sveltejs/kit';
import { customerFormSchema, shippingFormSchema, paymentFormSchema, reviewFormSchema } from '@/schemas';

export interface CheckoutStepValidation {
    canAccess: boolean;
    redirectTo?: string;
    missingSteps: string[];
    currentStep: number;
}

export class CheckoutStepValidator {
    private static parseCheckoutData(checkoutDataString?: string | null) {
        if (!checkoutDataString) return null;

        try {
            return JSON.parse(checkoutDataString);
        } catch {
            return null;
        }
    }

    private static validateStepData(stepName: string, data: any): boolean {
        if (!data) return false;

        try {
            switch (stepName) {
                case 'customer':
                    return customerFormSchema.safeParse(data).success;
                case 'shipping':
                    return shippingFormSchema.safeParse(data).success;
                case 'payment':
                    return paymentFormSchema.safeParse(data).success;
                case 'review':
                    return reviewFormSchema.safeParse(data).success;
                default:
                    return false;
            }
        } catch {
            return false;
        }
    }

    private static getStepNumber(stepName: string): number {
        const steps = { customer: 1, shipping: 2, payment: 3, review: 4 };
        return steps[stepName as keyof typeof steps] || 1;
    }

    private static getStepPath(stepNumber: number): string {
        const paths = {
            1: '/checkout/step/customer',
            2: '/checkout/step/shipping',
            3: '/checkout/step/payment',
            4: '/checkout/step/review',
        };
        return paths[stepNumber as keyof typeof paths] || '/checkout/step/customer';
    }

    static validateStepAccess(requestedStep: string, checkoutDataString?: string | null): CheckoutStepValidation {
        const checkoutData = this.parseCheckoutData(checkoutDataString);
        const requestedStepNumber = this.getStepNumber(requestedStep);

        if (!checkoutData) {
            return {
                canAccess: requestedStep === 'customer',
                redirectTo: requestedStep !== 'customer' ? '/checkout/step/customer' : undefined,
                missingSteps: ['customer', 'shipping', 'payment', 'review'],
                currentStep: 1,
            };
        }

        const completedSteps: string[] = [];
        const missingSteps: string[] = [];

        const stepChecks = [
            { name: 'customer', data: checkoutData.customer },
            { name: 'shipping', data: checkoutData.shipping },
            { name: 'payment', data: checkoutData.payment },
            { name: 'review', data: checkoutData.review },
        ];

        for (const step of stepChecks) {
            if (this.validateStepData(step.name, step.data)) {
                completedSteps.push(step.name);
            } else {
                missingSteps.push(step.name);
            }
        }

        const currentStep = completedSteps.length + 1;
        const canAccess = requestedStepNumber <= currentStep;

        return {
            canAccess,
            redirectTo: !canAccess ? this.getStepPath(currentStep) : undefined,
            missingSteps,
            currentStep,
        };
    }

    static requireStepAccess(requestedStep: string, checkoutDataString?: string | null): void {
        const validation = this.validateStepAccess(requestedStep, checkoutDataString);

        if (!validation.canAccess && validation.redirectTo) {
            throw redirect(302, validation.redirectTo);
        }
    }

    static getCheckoutProgress(checkoutDataString?: string | null): {
        completedSteps: string[];
        currentStep: number;
        nextStep: string | null;
        isComplete: boolean;
    } {
        const validation = this.validateStepAccess('review', checkoutDataString);
        const allSteps = ['customer', 'shipping', 'payment', 'review'];
        const completedSteps = allSteps.filter((step) => !validation.missingSteps.includes(step));

        return {
            completedSteps,
            currentStep: validation.currentStep,
            nextStep: validation.currentStep <= 4 ? allSteps[validation.currentStep - 1] : null,
            isComplete: completedSteps.length === 4,
        };
    }
}
