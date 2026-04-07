import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, ordersTable, usersTable, settingsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { UpdatePaymentQRBody } from "@workspace/api-zod";

const router = Router();

router.get("/stats", async (req, res) => {
  try {
    const [{ count: totalProducts }] = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(productsTable);
    const [{ count: totalOrders }] = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(ordersTable);
    const [{ count: totalUsers }] = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(usersTable);

    const allOrders = await db.select().from(ordersTable);
    const totalRevenue = allOrders.filter(o => o.status !== "Pending").reduce((s, o) => s + parseFloat(o.amount), 0);
    const pendingOrders = allOrders.filter(o => o.status === "Pending").length;

    const recentOrders = allOrders
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .map(o => ({
        id: o.id,
        userId: o.userId,
        userName: o.userName,
        items: o.items,
        amount: parseFloat(o.amount),
        address: o.address,
        phone: o.phone,
        utr: o.utr,
        status: o.status,
        trackingId: o.trackingId,
        createdAt: o.createdAt.toISOString(),
      }));

    const categoryCounts = await db.select({ name: productsTable.category, count: sql<number>`cast(count(*) as int)` }).from(productsTable).groupBy(productsTable.category);
    const categories = ["Dress", "Lifestyle", "Essentials", "Electronics", "Accessories"];
    const categoryBreakdown = categories.map(name => ({
      name,
      count: categoryCounts.find(c => c.name === name)?.count ?? 0,
      image: "",
    }));

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      pendingOrders,
      recentOrders,
      categoryBreakdown,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting admin stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/qr", async (req, res) => {
  try {
    const [setting] = await db.select().from(settingsTable).where(eq(settingsTable.key, "payment_qr"));
    res.json({ qrUrl: setting?.value ?? "" });
  } catch (err) {
    req.log.error({ err }, "Error getting QR");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/qr", async (req, res) => {
  try {
    const body = UpdatePaymentQRBody.parse(req.body);
    const existing = await db.select().from(settingsTable).where(eq(settingsTable.key, "payment_qr"));
    if (existing.length > 0) {
      await db.update(settingsTable).set({ value: body.qrUrl }).where(eq(settingsTable.key, "payment_qr"));
    } else {
      await db.insert(settingsTable).values({ key: "payment_qr", value: body.qrUrl });
    }
    res.json({ qrUrl: body.qrUrl });
  } catch (err) {
    req.log.error({ err }, "Error updating QR");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
