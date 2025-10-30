import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { paymentFormSchema } from '@/schemas';
import { fail } from '@sveltejs/kit';
import { CheckoutStepValidator } from '$lib/server/checkout/checkoutValidation';
import { CheckoutCookieManager } from '$lib/server/checkout/checkoutCookies';

export const load = async ({ cookies }) => {
    const checkoutData = CheckoutCookieManager.getCheckoutData(cookies);
    CheckoutStepValidator.requireStepAccess('payment', checkoutData);

    const form = await superValidate(zod4(paymentFormSchema));
    return { form };
};

export const actions = {
    validatePayment: async ({ request }) => {
        const form = await superValidate(request, zod4(paymentFormSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        return { form };
    },
};
