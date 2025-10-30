import { json } from '@sveltejs/kit';
import { checkoutFormSchema } from '@/schemas';
import { OrderService } from '$lib/server/services/orderService';
import { AuthService } from '$lib/server/services/authService';
import type { CheckoutData } from '$lib/types/checkout';
import type { CartItem } from '@/global-states';

export async function POST({ request }) {
    try {
        const { checkoutData, cartItems }: { checkoutData: CheckoutData; cartItems: CartItem[] } = await request.json();

        const user = await AuthService.getAuthenticatedUser(request);

        const validationResult = checkoutFormSchema.safeParse(checkoutData);
        if (!validationResult.success) {
            return json({ success: false, error: 'Invalid checkout data' }, { status: 400 });
        }

        if (!cartItems || cartItems.length === 0) {
            return json({ success: false, error: 'Cart is empty' }, { status: 400 });
        }

        const subtotal = cartItems.reduce(
            (sum: number, item: CartItem) => sum + Number(item.product.currentPrice) * item.quantity,
            0,
        );

        let shippingCost = 15.0;
        if (checkoutData.shipping?.shippingMethod === 'express') {
            shippingCost = 25.0;
        } else if (checkoutData.shipping?.shippingMethod === 'overnight') {
            shippingCost = 45.0;
        }

        const total = subtotal + shippingCost;

        const orderData = {
            id: crypto.randomUUID(),
            orderNumber: await OrderService.generateOrderNumber(),
            userId: user?.id || null,
            subtotal: subtotal.toString(),
            shipping: shippingCost.toString(),
            total: total.toString(),
            shippingAddress: {
                firstName: checkoutData.customer?.firstName || '',
                lastName: checkoutData.customer?.lastName || '',
                address: checkoutData.shipping?.address || '',
                city: checkoutData.shipping?.city || '',
                state: checkoutData.shipping?.state || '',
                zipCode: checkoutData.shipping?.zipCode || '',
                country: checkoutData.shipping?.country || 'US',
            },
            billingAddress: {
                firstName: checkoutData.customer?.firstName || '',
                lastName: checkoutData.customer?.lastName || '',
                address: checkoutData.shipping?.address || '',
                city: checkoutData.shipping?.city || '',
                state: checkoutData.shipping?.state || '',
                zipCode: checkoutData.shipping?.zipCode || '',
                country: checkoutData.shipping?.country || 'US',
            },
            paymentMethod: 'cash_on_delivery',
            paymentStatus: 'pending' as const,
            notes: checkoutData.review?.orderNotes || null,
        };

        const orderItems = cartItems.map((item: CartItem) => ({
            id: crypto.randomUUID(),
            orderId: orderData.id,
            productId: item.product.id,
            productTitle: item.product.title,
            productSlug: item.product.slug,
            productImage: item.product.images?.[0] || null,
            quantity: item.quantity,
            unitPrice: item.product.currentPrice.toString(),
            totalPrice: (Number(item.product.currentPrice) * item.quantity).toString(),
            productAttributes: {
                selectedSize: item.selectedSize,
                selectedColor: item.selectedColor,
            },
        }));

        const result = await OrderService.createOrderWithItems(orderData, orderItems);

        if (result.errors) {
            return json({ success: false, error: result.errors[0] }, { status: 500 });
        }

        return json({
            success: true,
            orderId: result.order?.id,
            orderNumber: result.order?.orderNumber,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
