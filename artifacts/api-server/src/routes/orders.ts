import { Router } from "express";
import { store } from "../data/store";
import { ListOrdersQueryParams, CreateOrderBody, GetOrderParams, UpdateOrderStatusParams, UpdateOrderStatusBody } from "@workspace/api-zod";

const router = Router();

router.get("/", (req, res) => {
  try {
    const query = ListOrdersQueryParams.parse(req.query);
    const orders = store.orders.list(query.userId);
    res.json(orders);
  } catch (err) {
    req.log.error({ err }, "Error listing orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", (req, res) => {
  try {
    const body = CreateOrderBody.parse(req.body);
    const user = store.users.get(body.userId);
    const order = store.orders.create({
      userId: body.userId,
      userName: user?.name ?? body.userId,
      items: body.items as any,
      amount: body.amount,
      address: body.address,
      phone: body.phone,
      utr: body.utr ?? "",
    });
    store.cart.clear(body.userId);
    res.status(201).json(order);
  } catch (err) {
    req.log.error({ err }, "Error creating order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", (req, res) => {
  try {
    const { id } = GetOrderParams.parse(req.params);
    const order = store.orders.get(id);
    if (!order) return res.status(404).json({ error: "Not found" });
    res.json(order);
  } catch (err) {
    req.log.error({ err }, "Error getting order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/status", (req, res) => {
  try {
    const { id } = UpdateOrderStatusParams.parse(req.params);
    const body = UpdateOrderStatusBody.parse(req.body);
    const order = store.orders.updateStatus(id, body.status, body.utr);
    if (!order) return res.status(404).json({ error: "Not found" });
    res.json(order);
  } catch (err) {
    req.log.error({ err }, "Error updating order status");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
