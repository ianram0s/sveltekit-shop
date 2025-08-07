import { z } from 'zod/v4';
import { browser } from '$app/environment';

export const STORAGE_VERSION = 1;

export const STORAGE_KEYS = {
    CHECKOUT_DATA: 'checkoutData',
    CART: 'cart',
    USER_PREFERENCES: 'userPreferences'
} as const;

export enum StorageError {
    NOT_AVAILABLE = 'STORAGE_NOT_AVAILABLE',
    QUOTA_EXCEEDED = 'STORAGE_QUOTA_EXCEEDED',
    CORRUPTED_DATA = 'CORRUPTED_DATA',
    PARSE_ERROR = 'PARSE_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR'
}

export class StorageException extends Error {
    constructor(
        public readonly storageError: StorageError,
        message?: string,
        public readonly originalError?: unknown
    ) {
        super(message || storageError);
        this.name = 'StorageException';
    }
}

const baseStorageSchema = z.object({
    version: z.number().default(STORAGE_VERSION),
    timestamp: z.number().default(() => Date.now()),
    data: z.unknown()
});

type BaseStorageData = z.infer<typeof baseStorageSchema>;

export class SafeLocalStorage {
    private static isAvailable(): boolean {
        if (!browser) return false;

        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, 'test');
            localStorage.removeItem(test);
            return true;
        } catch {
            return false;
        }
    }

    private static handleQuotaExceeded(key: string): void {
        console.warn(`LocalStorage quota exceeded for key: ${key}`);

        try {
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const storageKey = localStorage.key(i);
                if (storageKey && storageKey !== key) {
                    try {
                        const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
                        if (data.timestamp && Date.now() - data.timestamp > 7 * 24 * 60 * 60 * 1000) {
                            keysToRemove.push(storageKey);
                        }
                    } catch {
                        keysToRemove.push(storageKey);
                    }
                }
            }

            keysToRemove.forEach(keyToRemove => {
                localStorage.removeItem(keyToRemove);
            });
        } catch (error) {
            console.error('Failed to clean up localStorage:', error);
        }
    }

    private static logStorageEvent(event: string, key: string, error?: unknown): void {
        const logData = {
            event,
            key,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            error: error ? String(error) : undefined
        };

        console.warn('LocalStorage event:', logData);
    }

    static get<T>(key: string, schema: z.ZodSchema<T>): T | null {
        if (!this.isAvailable()) {
            this.logStorageEvent('storage_not_available', key);
            return null;
        }

        try {
            const rawData = localStorage.getItem(key);
            if (!rawData) {
                return null;
            }

            let parsedData: unknown;
            try {
                parsedData = JSON.parse(rawData);
            } catch (parseError) {
                this.logStorageEvent('parse_error', key, parseError);
                throw new StorageException(StorageError.PARSE_ERROR, `Failed to parse data for key: ${key}`, parseError);
            }

            if (typeof parsedData === 'object' && parsedData !== null && 'version' in parsedData) {
                const baseData = baseStorageSchema.safeParse(parsedData);
                if (baseData.success) {
                    if (baseData.data.version < STORAGE_VERSION) {
                        this.logStorageEvent('migration_needed', key);
                        this.remove(key);
                        return null;
                    }
                    parsedData = baseData.data.data;
                }
            }

            const validationResult = schema.safeParse(parsedData);
            if (!validationResult.success) {
                this.logStorageEvent('validation_error', key, validationResult.error);
                throw new StorageException(
                    StorageError.VALIDATION_ERROR,
                    `Data validation failed for key: ${key}`,
                    validationResult.error
                );
            }

            return validationResult.data;

        } catch (error) {
            if (error instanceof StorageException) {
                if (error.storageError === StorageError.CORRUPTED_DATA ||
                    error.storageError === StorageError.PARSE_ERROR ||
                    error.storageError === StorageError.VALIDATION_ERROR) {

                    this.logStorageEvent('corrupted_data_removed', key, error);
                    this.remove(key);
                    return null;
                }
                throw error;
            }

            this.logStorageEvent('unexpected_error', key, error);
            throw new StorageException(StorageError.CORRUPTED_DATA, `Unexpected error for key: ${key}`, error);
        }
    }

    static set<T>(key: string, data: T, schema?: z.ZodSchema<T>): boolean {
        if (!this.isAvailable()) {
            this.logStorageEvent('storage_not_available', key);
            return false;
        }

        if (schema) {
            const validationResult = schema.safeParse(data);
            if (!validationResult.success) {
                this.logStorageEvent('validation_error_on_set', key, validationResult.error);
                throw new StorageException(
                    StorageError.VALIDATION_ERROR,
                    `Data validation failed when setting key: ${key}`,
                    validationResult.error
                );
            }
        }

        const versionedData: BaseStorageData = {
            version: STORAGE_VERSION,
            timestamp: Date.now(),
            data
        };

        try {
            const serialized = JSON.stringify(versionedData);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            if (error instanceof DOMException && error.code === 22) {
                this.handleQuotaExceeded(key);
                this.logStorageEvent('quota_exceeded', key, error);

                try {
                    const serialized = JSON.stringify(versionedData);
                    localStorage.setItem(key, serialized);
                    return true;
                } catch (retryError) {
                    throw new StorageException(StorageError.QUOTA_EXCEEDED, `Storage quota exceeded for key: ${key}`, retryError);
                }
            }

            this.logStorageEvent('set_error', key, error);
            throw new StorageException(StorageError.CORRUPTED_DATA, `Failed to set data for key: ${key}`, error);
        }
    }

    static remove(key: string): void {
        if (!this.isAvailable()) {
            return;
        }

        try {
            localStorage.removeItem(key);
        } catch (error) {
            this.logStorageEvent('remove_error', key, error);
        }
    }

    static clear(): void {
        if (!this.isAvailable()) {
            return;
        }

        try {
            localStorage.clear();
        } catch (error) {
            this.logStorageEvent('clear_error', 'all', error);
        }
    }

    static getStorageInfo(): { used: number; available: number; keys: string[] } {
        if (!this.isAvailable()) {
            return { used: 0, available: 0, keys: [] };
        }

        const keys: string[] = [];
        let used = 0;

        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    keys.push(key);
                    const value = localStorage.getItem(key);
                    if (value) {
                        used += key.length + value.length;
                    }
                }
            }

            const estimated = 5 * 1024 * 1024;
            const available = Math.max(0, estimated - used);

            return { used, available, keys };
        } catch (error) {
            this.logStorageEvent('storage_info_error', 'info', error);
            return { used: 0, available: 0, keys: [] };
        }
    }

    static healthCheck(): { healthy: boolean; issues: string[] } {
        const issues: string[] = [];

        if (!this.isAvailable()) {
            issues.push('LocalStorage not available');
            return { healthy: false, issues };
        }

        try {
            const testKey = '__health_check__';
            const testData = { test: true, timestamp: Date.now() };

            localStorage.setItem(testKey, JSON.stringify(testData));
            const retrieved = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);

            if (!retrieved || JSON.parse(retrieved).test !== true) {
                issues.push('Read/write test failed');
            }

            const info = this.getStorageInfo();
            if (info.used > 4 * 1024 * 1024) {
                issues.push('Storage usage is high');
            }

            let corruptedCount = 0;
            info.keys.forEach(key => {
                try {
                    const value = localStorage.getItem(key);
                    if (value) {
                        JSON.parse(value);
                    }
                } catch {
                    corruptedCount++;
                }
            });

            if (corruptedCount > 0) {
                issues.push(`${corruptedCount} corrupted entries found`);
            }

        } catch (error) {
            issues.push(`Health check failed: ${error}`);
        }

        return { healthy: issues.length === 0, issues };
    }
}

export const storage = {
    get: <T>(key: string, schema: z.ZodSchema<T>) => SafeLocalStorage.get(key, schema),
    set: <T>(key: string, data: T, schema?: z.ZodSchema<T>) => SafeLocalStorage.set(key, data, schema),
    remove: (key: string) => SafeLocalStorage.remove(key),
    clear: () => SafeLocalStorage.clear(),
    getInfo: () => SafeLocalStorage.getStorageInfo(),
    healthCheck: () => SafeLocalStorage.healthCheck()
};
