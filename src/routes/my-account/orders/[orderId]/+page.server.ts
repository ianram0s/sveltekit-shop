import { redirect } from '@sveltejs/kit';
import { AuthService } from '$lib/server/services';
import { OrderService } from '$lib/server/services/orderService';

export async function load({ request, params }) {
    const user = await AuthService.requireAuth(request);
    const { orderId } = params;

    if (!orderId) {
        throw redirect(302, '/my-account/orders');
    }

    const result = await OrderService.getOrderById(orderId, { withItems: true });

    if (!result) {
        throw redirect(302, '/my-account/orders');
    }

    if (result.order.userId !== user.id) {
        throw redirect(302, '/my-account/orders');
    }

    return {
        user,
        order: result
    };
}


