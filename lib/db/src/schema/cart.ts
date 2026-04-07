import { pgTable, text, integer, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cartTable = pgTable("cart", {
  userId: text("user_id").notNull(),
  productId: text("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.productId] }),
}));

export const insertCartSchema = createInsertSchema(cartTable);
export type InsertCart = z.infer<typeof insertCartSchema>;
export type CartRow = typeof cartTable.$inferSelect;
