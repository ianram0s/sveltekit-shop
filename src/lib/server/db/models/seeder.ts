import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const seeder = pgTable("seeder", {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    executedAt: timestamp('executed_at').defaultNow().notNull()
});

export type Seeder = typeof seeder.$inferSelect;
export type NewSeeder = typeof seeder.$inferInsert; 