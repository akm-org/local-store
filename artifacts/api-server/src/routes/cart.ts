import { Router } from "express";
import { db } from "../db/client";
import { GetCartQueryParams, AddToCartBody, ClearCartQueryParams, RemoveFromCartParams, RemoveFromCartQueryParams } from "@workspace/api-zod";

const router = Router();

async function buildCartResponse(userId: string) {
  const cartItems = await db.cart.get(userId);
  const items = [];
  let total = 0;
  let itemCount = 0;

  for (const row of cartItems) {
    const product = row.product;
    if (product) {
      items.push({
        productId: row.productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: row.quantity,
        subtotal: product.price * row.quantity,
      });
      total += product.price * row.quantity;
      itemCount += row.quantity;
    }
  }

  return { userId, items, total, itemCount };
}

router.get("/", async (req, res) => {
  try {
    const { userId } = GetCartQueryParams.parse(req.query);
    res.json(await buildCartResponse(userId));
  } catch (err) {
    req.log.error({ err }, "Error getting cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = AddToCartBody.parse(req.body);
    await db.cart.add(body.userId, body.productId, body.quantity ?? 1);
    res.json(await buildCartResponse(body.userId));
  } catch (err) {
    req.log.error({ err }, "Error adding to cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:productId", async (req, res) => {
  try {
    const { productId } = RemoveFromCartParams.parse(req.params);
    const { userId } = RemoveFromCartQueryParams.parse(req.query);
    await db.cart.remove(userId, productId);
    res.json(await buildCartResponse(userId));
  } catch (err) {
    req.log.error({ err }, "Error removing from cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { userId } = ClearCartQueryParams.parse(req.query);
    await db.cart.clear(userId);
    res.json(await buildCartResponse(userId));
  } catch (err) {
    req.log.error({ err }, "Error clearing cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
