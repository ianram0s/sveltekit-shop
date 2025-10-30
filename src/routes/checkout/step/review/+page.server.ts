import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { reviewFormSchema } from '@/schemas';
import { fail } from '@sveltejs/kit';
import { CheckoutStepValidator } from '$lib/server/checkout/checkoutValidation';
import { CheckoutCookieManager } from '$lib/server/checkout/checkoutCookies';

export const load = async ({ cookies }) => {
    const checkoutData = CheckoutCookieManager.getCheckoutData(cookies);
    CheckoutStepValidator.requireStepAccess('review', checkoutData);

    const form = await superValidate(zod4(reviewFormSchema));
    return { form };
};

export const actions = {
    validateReview: async ({ request }) => {
        const form = await superValidate(request, zod4(reviewFormSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        return { form };
    },
};
