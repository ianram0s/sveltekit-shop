import { db } from '../db';
import { order, orderItem } from '../db/models';
import { eq, desc } from 'drizzle-orm';
import type { Order, NewOrder, OrderItem, NewOrderItem } from '../db/models';

export type OrderWithItems = { order: Order; items: OrderItem[] };

interface OrderOptions {
    withItems?: boolean;
}

export class OrderService {
    /**
     * Get order by ID
     */
    static async getOrderById(id: string, options: { withItems: true }): Promise<OrderWithItems | undefined>;
    static async getOrderById(id: string, options?: { withItems?: false }): Promise<Order | undefined>;
    static async getOrderById(id: string, options?: OrderOptions): Promise<Order | OrderWithItems | undefined> {
        try {
            const result = await db.query.order.findFirst({
                where: eq(order.id, id)
            });

            if (!result) return undefined;

            if (options?.withItems) {
                const items = await db.query.orderItem.findMany({
                    where: eq(orderItem.orderId, id)
                });
                return { order: result, items };
            }

            return result as Order;
        } catch (error) {
            console.error('Error getting order by ID:', error);
            return undefined;
        }
    }

    /**
     * Get order by order number
     */
    static async getOrderByOrderNumber(orderNumber: string, options: { withItems: true }): Promise<OrderWithItems | undefined>;
    static async getOrderByOrderNumber(orderNumber: string, options?: { withItems?: false }): Promise<Order | undefined>;
    static async getOrderByOrderNumber(orderNumber: string, options?: OrderOptions): Promise<Order | OrderWithItems | undefined> {
        try {
            const result = await db.query.order.findFirst({
                where: eq(order.orderNumber, orderNumber)
            });

            if (!result) return undefined;

            if (options?.withItems) {
                const items = await db.query.orderItem.findMany({
                    where: eq(orderItem.orderId, result.id)
                });
                return { order: result, items };
            }

            return result;
        } catch (error) {
            console.error('Error getting order by order number:', error);
            return undefined;
        }
    }

    /**
     * Get orders by user ID
     */
    static async getOrdersByUser(userId: string, options: { withItems: true }): Promise<OrderWithItems[]>;
    static async getOrdersByUser(userId: string, options?: { withItems?: false }): Promise<Order[]>;
    static async getOrdersByUser(userId: string, options?: OrderOptions): Promise<Order[] | (OrderWithItems)[]> {
        try {
            const result = await db.query.order.findMany({
                where: eq(order.userId, userId),
                orderBy: [desc(order.createdAt)]
            });

            if (options?.withItems) {
                const ordersWithItems: OrderWithItems[] = [];
                for (const order of result) {
                    const items = await db.query.orderItem.findMany({
                        where: eq(orderItem.orderId, order.id)
                    });
                    ordersWithItems.push({ order, items });
                }
                return ordersWithItems;
            }

            return result;
        } catch (error) {
            console.error('Error getting orders by user ID:', error);
            return [];
        }
    }

    /**
     * Get orders by status
     */
    static async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
        try {
            const result = await db.query.order.findMany({
                where: eq(order.status, status),
                orderBy: [desc(order.createdAt)]
            });
            return result;
        } catch (error) {
            console.error('Error getting orders by status:', error);
            return [];
        }
    }

    /**
     * Get orders by payment status
     */
    static async getOrdersByPaymentStatus(paymentStatus: Order['paymentStatus']): Promise<Order[]> {
        try {
            const result = await db.query.order.findMany({
                where: eq(order.paymentStatus, paymentStatus),
                orderBy: [desc(order.createdAt)]
            });
            return result;
        } catch (error) {
            console.error('Error getting orders by payment status:', error);
            return [];
        }
    }

    /**
     * Create new order
     */
    static async createOrder(orderData: NewOrder): Promise<{ order?: Order; errors?: string[] }> {
        try {
            if (!orderData.orderNumber) {
                orderData.orderNumber = await this.generateOrderNumber();
            }

            if (orderData.paymentMethod === 'cash_on_delivery') {
                orderData.status = 'processing';
            } else {
                orderData.status = 'pending';
            }

            const [newOrder] = await db.insert(order).values(orderData).returning();
            return { order: newOrder };
        } catch (error) {
            console.error('Error creating order:', error);
            return { errors: ['Failed to create order'] };
        }
    }

    /**
     * Create order with items
     */
    static async createOrderWithItems(
        orderData: NewOrder,
        itemsData: NewOrderItem[]
    ): Promise<{ order?: Order; items?: OrderItem[]; errors?: string[] }> {
        try {
            // Generate order number if not provided
            if (!orderData.orderNumber) {
                orderData.orderNumber = await this.generateOrderNumber();
            }

            // Set initial status based on payment method
            if (orderData.paymentMethod === 'cash_on_delivery') {
                orderData.status = 'processing';
            } else {
                orderData.status = 'pending';
            }

            // Start a transaction
            return await db.transaction(async (tx) => {
                // Create the order
                const [newOrder] = await tx.insert(order).values(orderData).returning();

                // Create order items
                const itemsWithOrderId = itemsData.map(item => ({
                    ...item,
                    orderId: newOrder.id
                }));

                const newItems = await tx.insert(orderItem).values(itemsWithOrderId).returning();

                return { order: newOrder, items: newItems };
            });
        } catch (error) {
            console.error('Error creating order with items:', error);
            return { errors: ['Failed to create order with items'] };
        }
    }

    /**
     * Update order status
     */
    static async updateOrderStatus(id: string, status: Order['status']): Promise<{ order?: Order; errors?: string[] }> {
        try {
            const [updatedOrder] = await db
                .update(order)
                .set({ status, updatedAt: new Date() })
                .where(eq(order.id, id))
                .returning();

            if (!updatedOrder) {
                return { errors: ['Order not found'] };
            }

            return { order: updatedOrder };
        } catch (error) {
            console.error('Error updating order status:', error);
            return { errors: ['Failed to update order status'] };
        }
    }

    /**
     * Update payment status
     */
    static async updatePaymentStatus(id: string, paymentStatus: Order['paymentStatus']): Promise<{ order?: Order; errors?: string[] }> {
        try {
            const [updatedOrder] = await db
                .update(order)
                .set({ paymentStatus, updatedAt: new Date() })
                .where(eq(order.id, id))
                .returning();

            if (!updatedOrder) {
                return { errors: ['Order not found'] };
            }

            return { order: updatedOrder };
        } catch (error) {
            console.error('Error updating payment status:', error);
            return { errors: ['Failed to update payment status'] };
        }
    }

    /**
     * Update order tracking information
     */
    static async updateTrackingInfo(
        id: string,
        trackingNumber: string,
        estimatedDelivery?: Date
    ): Promise<{ order?: Order; errors?: string[] }> {
        try {
            const updateData: Partial<Order> = {
                trackingNumber,
                updatedAt: new Date()
            };

            if (estimatedDelivery) {
                updateData.estimatedDelivery = estimatedDelivery;
            }

            const [updatedOrder] = await db
                .update(order)
                .set(updateData)
                .where(eq(order.id, id))
                .returning();

            if (!updatedOrder) {
                return { errors: ['Order not found'] };
            }

            return { order: updatedOrder };
        } catch (error) {
            console.error('Error updating tracking info:', error);
            return { errors: ['Failed to update tracking information'] };
        }
    }

    /**
     * Add item to existing order
     */
    static async addItemToOrder(itemData: NewOrderItem): Promise<{ item?: OrderItem; errors?: string[] }> {
        try {
            const [newItem] = await db.insert(orderItem).values(itemData).returning();
            return { item: newItem };
        } catch (error) {
            console.error('Error adding item to order:', error);
            return { errors: ['Failed to add item to order'] };
        }
    }

    /**
     * Remove item from order
     */
    static async removeItemFromOrder(itemId: string): Promise<{ success?: boolean; errors?: string[] }> {
        try {
            const result = await db.delete(orderItem).where(eq(orderItem.id, itemId));
            return { success: true };
        } catch (error) {
            console.error('Error removing item from order:', error);
            return { errors: ['Failed to remove item from order'] };
        }
    }

    /**
     * Update item quantity
     */
    static async updateItemQuantity(itemId: string, quantity: number): Promise<{ item?: OrderItem; errors?: string[] }> {
        try {
            const [updatedItem] = await db
                .update(orderItem)
                .set({ quantity, updatedAt: new Date() })
                .where(eq(orderItem.id, itemId))
                .returning();

            if (!updatedItem) {
                return { errors: ['Order item not found'] };
            }

            return { item: updatedItem };
        } catch (error) {
            console.error('Error updating item quantity:', error);
            return { errors: ['Failed to update item quantity'] };
        }
    }

    /**
     * Get all orders (admin function)
     */
    static async getAllOrders(): Promise<Order[]> {
        try {
            const result = await db.query.order.findMany({
                orderBy: [desc(order.createdAt)]
            });
            return result;
        } catch (error) {
            console.error('Error getting all orders:', error);
            return [];
        }
    }

    /**
     * Get orders with user information
     */
    static async getOrdersWithUser(): Promise<(Order & { user: { name: string; email: string } })[]> {
        try {
            const result = await db.query.order.findMany({
                with: {
                    user: {
                        columns: {
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: [desc(order.createdAt)]
            });
            return result;
        } catch (error) {
            console.error('Error getting orders with user:', error);
            return [];
        }
    }

    /**
     * Generate unique order number
     */
    static async generateOrderNumber(): Promise<string> {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        const orderNumber = `DEMO-${timestamp}-${random}`;

        const existingOrder = await this.getOrderByOrderNumber(orderNumber);
        if (existingOrder) {
            return this.generateOrderNumber();
        }

        return orderNumber;
    }
} 