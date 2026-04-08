import { Router } from "express";
import { db } from "../db/client";
import { LoginBody, SignupBody, AdminLoginBody } from "@workspace/api-zod";

const router = Router();

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "webdeveloper";

router.post("/login", async (req, res) => {
  try {
    const body = LoginBody.parse(req.body);
    const user = await db.users.getByEmail(body.email);
    if (!user || user.password !== body.password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json({
      user: { id: user.id, name: user.name, email: user.email, address: user.address, phone: user.phone },
      token: `tok_${user.id}`,
      isAdmin: false,
    });
  } catch (err) {
    req.log.error({ err }, "Error logging in");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const body = SignupBody.parse(req.body);
    const existing = await db.users.getByEmail(body.email);
    if (existing) return res.status(409).json({ error: "Email already registered" });
    const user = await db.users.create({
      name: body.name,
      email: body.email,
      password: body.password,
      address: body.address ?? "",
      phone: body.phone ?? "",
    });
    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, address: user.address, phone: user.phone },
      token: `tok_${user.id}`,
      isAdmin: false,
    });
  } catch (err) {
    req.log.error({ err }, "Error signing up");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin-login", async (req, res) => {
  try {
    const body = AdminLoginBody.parse(req.body);
    if (body.username !== ADMIN_USERNAME || body.password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({
      user: { id: "admin", name: "Admin", email: "admin@localstore.com", address: "", phone: "" },
      token: "tok_admin",
      isAdmin: true,
    });
  } catch (err) {
    req.log.error({ err }, "Error admin login");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
