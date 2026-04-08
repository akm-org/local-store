import { Router } from "express";
import { db } from "../db/client";
import { GetWishlistQueryParams, ToggleWishlistBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { userId } = GetWishlistQueryParams.parse(req.query);
    const productIds = await db.wishlist.get(userId);
    res.json({ userId, productIds });
  } catch (err) {
    req.log.error({ err }, "Error getting wishlist");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/toggle", async (req, res) => {
  try {
    const body = ToggleWishlistBody.parse(req.body);
    const added = await db.wishlist.toggle(body.userId, body.productId);
    const productIds = await db.wishlist.get(body.userId);
    res.json({ userId: body.userId, productIds, added });
  } catch (err) {
    req.log.error({ err }, "Error toggling wishlist");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
