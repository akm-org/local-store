import { Router } from "express";
import { store } from "../data/store";
import { UpdatePaymentQRBody } from "@workspace/api-zod";

const router = Router();

router.get("/stats", (req, res) => {
  try {
    const stats = store.stats();
    res.json(stats);
  } catch (err) {
    req.log.error({ err }, "Error getting stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/payment", (req, res) => {
  try {
    const settings = store.settings.get();
    res.json({ upiId: settings.upiId, qrImage: settings.qrImage });
  } catch (err) {
    req.log.error({ err }, "Error getting payment settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/payment", (req, res) => {
  try {
    const body = UpdatePaymentQRBody.parse(req.body);
    const settings = store.settings.update({ upiId: body.upiId, qrImage: body.qrImage });
    res.json({ upiId: settings.upiId, qrImage: settings.qrImage });
  } catch (err) {
    req.log.error({ err }, "Error updating payment settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
