import { pgTable, text, numeric, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  userName: text("user_name").notNull().default(""),
  items: jsonb("items").notNull().$type<Array<{ productId: string; quantity: number; price: number; productName: string }>>(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  utr: text("utr").notNull().default(""),
  status: text("status").notNull().default("Pending"),
  trackingId: text("tracking_id").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
