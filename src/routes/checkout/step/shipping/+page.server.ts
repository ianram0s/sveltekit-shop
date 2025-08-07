import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { shippingFormSchema, type ShippingFormInput } from '@/schemas';
import { CheckoutStepValidator } from '$lib/server/checkout/checkoutValidation';
import { CheckoutCookieManager } from '$lib/server/checkout/checkoutCookies';

export async function load({ parent, cookies }) {
	const { user } = await parent();

	const checkoutData = CheckoutCookieManager.getCheckoutData(cookies);
	CheckoutStepValidator.requireStepAccess('shipping', checkoutData);

	let initialData = {
		address: '',
		city: '',
		state: '',
		zipCode: '',
		country: 'US',
		shippingMethod: 'standard'
	} as ShippingFormInput;

	const shippingForm = await superValidate(initialData, zod4(shippingFormSchema), {
		errors: false
	});

	return {
		user,
		shippingForm
	};
}

export const actions = {
	validateShipping: async ({ request }) => {
		const shippingForm = await superValidate(request, zod4(shippingFormSchema));

		if (!shippingForm.valid) {
			return fail(400, { shippingForm });
		}

		return { shippingForm };
	}
}; 