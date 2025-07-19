import { pgTable, text, timestamp, integer, boolean, decimal, jsonb } from "drizzle-orm/pg-core";

export const product = pgTable("product", {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    slug: text('slug').notNull().unique(),
    currentPrice: decimal('current_price', { precision: 10, scale: 2 }).notNull(),
    originalPrice: decimal('original_price', { precision: 10, scale: 2 }),
    images: jsonb('images').$type<string[]>().notNull().default([]),
    inStock: boolean('in_stock').notNull().default(true),
    rating: decimal('rating', { precision: 3, scale: 2 }),
    reviewCount: integer('review_count').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const productAttributes = pgTable("product_attributes", {
    id: text('id').primaryKey(),
    productId: text('product_id').notNull().references(() => product.id, { onDelete: 'cascade' }),
    attributeKey: text('attribute_key').notNull(),
    attributeValue: jsonb('attribute_value').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export type Product = typeof product.$inferSelect;
export type NewProduct = typeof product.$inferInsert;

export type ProductAttributes = typeof productAttributes.$inferSelect;
export type NewProductAttributes = typeof productAttributes.$inferInsert; 