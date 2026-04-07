import { Router } from "express";
import { db } from "@workspace/db";
import { cartTable, productsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { GetCartQueryParams, AddToCartBody, ClearCartQueryParams, RemoveFromCartParams, RemoveFromCartQueryParams } from "@workspace/api-zod";

const router = Router();

async function buildCart(userId: string) {
  const cartRows = await db.select().from(cartTable).where(eq(cartTable.userId, userId));
  const items = [];
  let total = 0;
  let itemCount = 0;

  for (const row of cartRows) {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, row.productId));
    if (product) {
      const price = parseFloat(product.price);
      items.push({
        productId: row.productId,
        quantity: row.quantity,
        product: {
          id: product.id,
          name: product.name,
          category: product.category,
          price,
          stock: product.stock,
          image: product.image,
          description: product.description,
          createdAt: product.createdAt.toISOString(),
        },
      });
      total += price * row.quantity;
      itemCount += row.quantity;
    }
  }

  return { userId, items, total, itemCount };
}

router.get("/", async (req, res) => {
  try {
    const { userId } = GetCartQueryParams.parse(req.query);
    const cart = await buildCart(userId);
    res.json(cart);
  } catch (err) {
    req.log.error({ err }, "Error getting cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = AddToCartBody.parse(req.body);
    const existing = await db.select().from(cartTable).where(
      and(eq(cartTable.userId, body.userId), eq(cartTable.productId, body.productId))
    );

    if (existing.length > 0) {
      await db.update(cartTable)
        .set({ quantity: existing[0].quantity + body.quantity })
        .where(and(eq(cartTable.userId, body.userId), eq(cartTable.productId, body.productId)));
    } else {
      await db.insert(cartTable).values({
        userId: body.userId,
        productId: body.productId,
        quantity: body.quantity,
      });
    }

    const cart = await buildCart(body.userId);
    res.json(cart);
  } catch (err) {
    req.log.error({ err }, "Error adding to cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { userId } = ClearCartQueryParams.parse(req.query);
    await db.delete(cartTable).where(eq(cartTable.userId, userId));
    res.json({ message: "Cart cleared" });
  } catch (err) {
    req.log.error({ err }, "Error clearing cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:productId", async (req, res) => {
  try {
    const { productId } = RemoveFromCartParams.parse(req.params);
    const { userId } = RemoveFromCartQueryParams.parse(req.query);
    await db.delete(cartTable).where(
      and(eq(cartTable.userId, userId), eq(cartTable.productId, productId))
    );
    const cart = await buildCart(userId);
    res.json(cart);
  } catch (err) {
    req.log.error({ err }, "Error removing from cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
