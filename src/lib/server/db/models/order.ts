import { pgTable, text, timestamp, integer, decimal, jsonb } from 'drizzle-orm/pg-core';
import { user } from './user';
import { product } from './product';

export const order = pgTable('order', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
    orderNumber: text('order_number').notNull().unique(),
    status: text('status', {
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    })
        .notNull()
        .default('pending'),
    subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
    shipping: decimal('shipping', { precision: 10, scale: 2 }).notNull().default('0.00'),
    total: decimal('total', { precision: 10, scale: 2 }).notNull(),
    shippingAddress: jsonb('shipping_address').$type<{
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    }>(),
    billingAddress: jsonb('billing_address').$type<{
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    }>(),
    paymentMethod: text('payment_method'),
    paymentStatus: text('payment_status', {
        enum: ['pending', 'paid', 'failed', 'refunded'],
    })
        .notNull()
        .default('pending'),
    notes: text('notes'),
    trackingNumber: text('tracking_number'),
    estimatedDelivery: timestamp('estimated_delivery'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orderItem = pgTable('order_item', {
    id: text('id').primaryKey(),
    orderId: text('order_id')
        .notNull()
        .references(() => order.id, { onDelete: 'cascade' }),
    productId: text('product_id')
        .notNull()
        .references(() => product.id, { onDelete: 'restrict' }),
    productTitle: text('product_title').notNull(),
    productSlug: text('product_slug').notNull(),
    productImage: text('product_image'),
    quantity: integer('quantity').notNull(),
    unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
    totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
    productAttributes: jsonb('product_attributes').$type<Record<string, any>>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Order = typeof order.$inferSelect;
export type NewOrder = typeof order.$inferInsert;

export type OrderItem = typeof orderItem.$inferSelect;
export type NewOrderItem = typeof orderItem.$inferInsert;
