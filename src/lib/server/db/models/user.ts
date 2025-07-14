import { pgTable, text, timestamp, boolean, date } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text('image'),
    phone: text('phone'),
    dateOfBirth: date('date_of_birth'),
    role: text('role', { enum: ['user', 'admin', 'owner'] }).notNull().default('user'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert; 