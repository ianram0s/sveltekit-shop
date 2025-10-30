import type { Cookies } from '@sveltejs/kit';

const CHECKOUT_COOKIE_NAME = 'checkout_progress';
const COOKIE_OPTIONS = {
    path: '/',
    maxAge: 60 * 60 * 24,
    httpOnly: false,
    secure: false,
    sameSite: 'lax' as const,
};

export class CheckoutCookieManager {
    static getCheckoutData(cookies: Cookies): string | null {
        return cookies.get(CHECKOUT_COOKIE_NAME) || null;
    }

    static setCheckoutData(cookies: Cookies, data: string): void {
        cookies.set(CHECKOUT_COOKIE_NAME, data, COOKIE_OPTIONS);
    }

    static clearCheckoutData(cookies: Cookies): void {
        cookies.delete(CHECKOUT_COOKIE_NAME, { path: '/' });
    }

    static syncFromLocalStorage(cookies: Cookies, localStorageData?: string): void {
        if (localStorageData) {
            this.setCheckoutData(cookies, localStorageData);
        }
    }
}
