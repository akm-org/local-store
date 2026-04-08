import express from "express";
import cors from "cors";
import productsRouter from "../artifacts/api-server/src/routes/products";
import categoriesRouter from "../artifacts/api-server/src/routes/categories";
import authRouter from "../artifacts/api-server/src/routes/auth";
import cartRouter from "../artifacts/api-server/src/routes/cart";
import ordersRouter from "../artifacts/api-server/src/routes/orders";
import adminRouter from "../artifacts/api-server/src/routes/admin";
import wishlistRouter from "../artifacts/api-server/src/routes/wishlist";
import healthRouter from "../artifacts/api-server/src/routes/health";

function makeLogger() {
  return {
    error: (data: unknown, msg?: string) => console.error(msg ?? data, msg ? data : ""),
    info: (data: unknown, msg?: string) => console.log(msg ?? data, msg ? data : ""),
    warn: (data: unknown, msg?: string) => console.warn(msg ?? data, msg ? data : ""),
    debug: () => {},
    trace: () => {},
    fatal: (data: unknown, msg?: string) => console.error(msg ?? data, msg ? data : ""),
    child: () => makeLogger(),
  };
}

function loggerMiddleware(req: express.Request & { log?: ReturnType<typeof makeLogger> }, _res: express.Response, next: express.NextFunction) {
  req.log = makeLogger();
  next();
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

const router = express.Router();
router.use(healthRouter);
router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
router.use("/auth", authRouter);
router.use("/cart", cartRouter);
router.use("/orders", ordersRouter);
router.use("/admin", adminRouter);
router.use("/wishlist", wishlistRouter);

app.use("/api", router);

export default app;
