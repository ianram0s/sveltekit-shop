import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { product } from './product';

export const category = pgTable('category', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productCategory = pgTable('product_category', {
    id: text('id').primaryKey(),
    productId: text('product_id')
        .notNull()
        .references(() => product.id, { onDelete: 'cascade' }),
    categoryId: text('category_id')
        .notNull()
        .references(() => category.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Category = typeof category.$inferSelect;
export type NewCategory = typeof category.$inferInsert;

export type ProductCategory = typeof productCategory.$inferSelect;
export type NewProductCategory = typeof productCategory.$inferInsert;
