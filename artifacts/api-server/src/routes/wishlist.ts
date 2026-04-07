import { Router } from "express";
import { db } from "@workspace/db";
import { wishlistTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { GetWishlistQueryParams, ToggleWishlistBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { userId } = GetWishlistQueryParams.parse(req.query);
    const items = await db.select().from(wishlistTable).where(eq(wishlistTable.userId, userId));
    res.json({
      userId,
      productIds: items.map(i => i.productId),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting wishlist");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = ToggleWishlistBody.parse(req.body);
    const existing = await db.select().from(wishlistTable).where(
      and(eq(wishlistTable.userId, body.userId), eq(wishlistTable.productId, body.productId))
    );

    if (existing.length > 0) {
      await db.delete(wishlistTable).where(
        and(eq(wishlistTable.userId, body.userId), eq(wishlistTable.productId, body.productId))
      );
    } else {
      await db.insert(wishlistTable).values({ userId: body.userId, productId: body.productId });
    }

    const items = await db.select().from(wishlistTable).where(eq(wishlistTable.userId, body.userId));
    res.json({
      userId: body.userId,
      productIds: items.map(i => i.productId),
    });
  } catch (err) {
    req.log.error({ err }, "Error toggling wishlist");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
