import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// Helper to standardise the CUID primary key
const id = () => text('id').primaryKey().$defaultFn(() => createId());

// Simple table creation
export const users = pgTable('users', {
    id: id(),
    email: text('email').notNull().unique(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});