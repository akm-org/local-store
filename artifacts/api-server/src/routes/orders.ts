import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ListOrdersQueryParams, CreateOrderBody, GetOrderParams, UpdateOrderStatusParams, UpdateOrderStatusBody } from "@workspace/api-zod";

const router = Router();

function generateId(prefix: string): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
}

function formatOrder(order: typeof ordersTable.$inferSelect) {
  return {
    id: order.id,
    userId: order.userId,
    userName: order.userName,
    items: order.items,
    amount: parseFloat(order.amount),
    address: order.address,
    phone: order.phone,
    utr: order.utr,
    status: order.status,
    trackingId: order.trackingId,
    createdAt: order.createdAt.toISOString(),
  };
}

router.get("/", async (req, res) => {
  try {
    const { userId } = ListOrdersQueryParams.parse(req.query);
    let orders;
    if (userId) {
      orders = await db.select().from(ordersTable).where(eq(ordersTable.userId, userId));
    } else {
      orders = await db.select().from(ordersTable);
    }
    orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    res.json(orders.map(formatOrder));
  } catch (err) {
    req.log.error({ err }, "Error listing orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = CreateOrderBody.parse(req.body);
    const id = generateId("ORD");

    let userName = "";
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, body.userId));
    if (user) userName = user.name;

    await db.insert(ordersTable).values({
      id,
      userId: body.userId,
      userName,
      items: body.items,
      amount: String(body.amount),
      address: body.address,
      phone: body.phone,
      utr: body.utr,
      status: "Pending",
      trackingId: "",
    });

    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    res.status(201).json(formatOrder(order));
  } catch (err) {
    req.log.error({ err }, "Error creating order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = GetOrderParams.parse(req.params);
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!order) return res.status(404).json({ error: "Not found" });
    res.json(formatOrder(order));
  } catch (err) {
    req.log.error({ err }, "Error getting order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = UpdateOrderStatusParams.parse(req.params);
    const body = UpdateOrderStatusBody.parse(req.body);

    const updateData: Record<string, string> = { status: body.status };
    if (body.trackingId !== undefined) updateData.trackingId = body.trackingId;

    await db.update(ordersTable).set(updateData).where(eq(ordersTable.id, id));

    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!order) return res.status(404).json({ error: "Not found" });
    res.json(formatOrder(order));
  } catch (err) {
    req.log.error({ err }, "Error updating order");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
