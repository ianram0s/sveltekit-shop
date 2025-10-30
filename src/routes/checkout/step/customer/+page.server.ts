import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { customerFormSchema } from '@/schemas';
import { CheckoutStepValidator } from '$lib/server/checkout/checkoutValidation';
import { CheckoutCookieManager } from '$lib/server/checkout/checkoutCookies';

export async function load({ parent, cookies }) {
    const { user } = await parent();

    const checkoutData = CheckoutCookieManager.getCheckoutData(cookies);
    CheckoutStepValidator.requireStepAccess('customer', checkoutData);

    let initialData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    };

    if (user) {
        const nameParts = user.name?.split(' ') || [];
        initialData = {
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: user.email || '',
            phone: user.phone || '',
        };
    }

    const customerForm = await superValidate(initialData, zod4(customerFormSchema), {
        errors: false,
    });

    return {
        user,
        customerForm,
    };
}

export const actions = {
    validateCustomer: async ({ request }) => {
        const customerForm = await superValidate(request, zod4(customerFormSchema));

        if (!customerForm.valid) {
            return fail(400, { customerForm });
        }

        return { customerForm };
    },
};
