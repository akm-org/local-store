import { Router } from "express";
import { store } from "../data/store";
import { GetWishlistQueryParams, ToggleWishlistBody } from "@workspace/api-zod";

const router = Router();

router.get("/", (req, res) => {
  try {
    const { userId } = GetWishlistQueryParams.parse(req.query);
    const productIds = store.wishlist.get(userId);
    res.json({ userId, productIds });
  } catch (err) {
    req.log.error({ err }, "Error getting wishlist");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/toggle", (req, res) => {
  try {
    const body = ToggleWishlistBody.parse(req.body);
    const added = store.wishlist.toggle(body.userId, body.productId);
    const productIds = store.wishlist.get(body.userId);
    res.json({ userId: body.userId, productIds, added });
  } catch (err) {
    req.log.error({ err }, "Error toggling wishlist");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
