import { OrderService } from '$lib/server/services/orderService';
import { redirect } from '@sveltejs/kit';

export const load = async ({ url }) => {
	const orderId = url.searchParams.get('orderId');

	if (!orderId) {
		throw redirect(302, '/');
	}

	try {
		const result = await OrderService.getOrderById(orderId);

		if (!result) {
			throw redirect(302, '/');
		}

		return {
			order: result
		};
	} catch (error) {
		console.error('Error loading order:', error);
		throw redirect(302, '/');
	}
};
