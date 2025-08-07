import { redirect } from '@sveltejs/kit';
import { CheckoutStepValidator } from '$lib/server/checkout/checkoutValidation';
import { CheckoutCookieManager } from '$lib/server/checkout/checkoutCookies';

export async function load({ cookies }) {
    const checkoutData = CheckoutCookieManager.getCheckoutData(cookies);
    const progress = CheckoutStepValidator.getCheckoutProgress(checkoutData);

    const stepPaths = {
        1: '/checkout/step/customer',
        2: '/checkout/step/shipping',
        3: '/checkout/step/payment',
        4: '/checkout/step/review'
    };

    const redirectTo = stepPaths[progress.currentStep as keyof typeof stepPaths] || '/checkout/step/customer';
    throw redirect(302, redirectTo);
} 