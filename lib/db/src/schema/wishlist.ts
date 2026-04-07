import { pgTable, text, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const wishlistTable = pgTable("wishlist", {
  userId: text("user_id").notNull(),
  productId: text("product_id").notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.productId] }),
}));

export const insertWishlistSchema = createInsertSchema(wishlistTable);
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type WishlistRow = typeof wishlistTable.$inferSelect;
