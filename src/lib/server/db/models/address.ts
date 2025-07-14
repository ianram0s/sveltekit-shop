import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { user } from "./user";

export const address = pgTable("address", {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    street: text('street').notNull(),
    city: text('city').notNull(),
    state: text('state').notNull(),
    zipCode: text('zip_code').notNull(),
    country: text('country').notNull(),
    isDefault: boolean('is_default').default(false).notNull(),
    label: text('label'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export type Address = typeof address.$inferSelect;
export type NewAddress = typeof address.$inferInsert; 