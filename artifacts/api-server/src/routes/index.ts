import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import authRouter from "./auth";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import adminRouter from "./admin";
import wishlistRouter from "./wishlist";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
router.use("/auth", authRouter);
router.use("/cart", cartRouter);
router.use("/orders", ordersRouter);
router.use("/admin", adminRouter);
router.use("/wishlist", wishlistRouter);

export default router;
