import { AuthService } from '$lib/server/services';
import { OrderService } from '$lib/server/services/orderService';

export async function load({ request }) {
    const user = await AuthService.requireAuth(request);
    const orders = await OrderService.getOrdersByUser(user.id);

    return {
        user,
        orders
    };
}


