import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq, ilike, and, gte, lte, asc, desc } from "drizzle-orm";
import { CreateProductBody, ListProductsQueryParams, GetProductParams, UpdateProductParams, UpdateProductBody, DeleteProductParams } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const query = ListProductsQueryParams.parse(req.query);
    let conditions: ReturnType<typeof eq>[] = [];

    let dbQuery = db.select().from(productsTable);
    const filters: any[] = [];

    if (query.category) filters.push(eq(productsTable.category, query.category));
    if (query.search) filters.push(ilike(productsTable.name, `%${query.search}%`));
    if (query.minPrice !== undefined) filters.push(gte(productsTable.price, String(query.minPrice)));
    if (query.maxPrice !== undefined) filters.push(lte(productsTable.price, String(query.maxPrice)));

    let finalQuery = filters.length > 0
      ? db.select().from(productsTable).where(and(...filters))
      : db.select().from(productsTable);

    let products;
    if (query.sort === "price_asc") {
      products = await db.select().from(productsTable).where(filters.length > 0 ? and(...filters) : undefined).orderBy(asc(productsTable.price));
    } else if (query.sort === "price_desc") {
      products = await db.select().from(productsTable).where(filters.length > 0 ? and(...filters) : undefined).orderBy(desc(productsTable.price));
    } else if (query.sort === "newest") {
      products = await db.select().from(productsTable).where(filters.length > 0 ? and(...filters) : undefined).orderBy(desc(productsTable.createdAt));
    } else {
      products = await db.select().from(productsTable).where(filters.length > 0 ? and(...filters) : undefined).orderBy(desc(productsTable.createdAt));
    }

    const formatted = products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: parseFloat(p.price),
      stock: p.stock,
      image: p.image,
      description: p.description,
      createdAt: p.createdAt.toISOString(),
    }));

    res.json(formatted);
  } catch (err) {
    req.log.error({ err }, "Error listing products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = CreateProductBody.parse(req.body);
    const id = `P${Date.now().toString(36).toUpperCase()}`;
    await db.insert(productsTable).values({
      id,
      name: body.name,
      category: body.category,
      price: String(body.price),
      stock: body.stock,
      image: body.image,
      description: body.description,
    });
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
    res.status(201).json({
      id: product.id,
      name: product.name,
      category: product.category,
      price: parseFloat(product.price),
      stock: product.stock,
      image: product.image,
      description: product.description,
      createdAt: product.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error creating product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = GetProductParams.parse(req.params);
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json({
      id: product.id,
      name: product.name,
      category: product.category,
      price: parseFloat(product.price),
      stock: product.stock,
      image: product.image,
      description: product.description,
      createdAt: product.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = UpdateProductParams.parse(req.params);
    const body = UpdateProductBody.parse(req.body);
    await db.update(productsTable).set({
      name: body.name,
      category: body.category,
      price: String(body.price),
      stock: body.stock,
      image: body.image,
      description: body.description,
    }).where(eq(productsTable.id, id));
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json({
      id: product.id,
      name: product.name,
      category: product.category,
      price: parseFloat(product.price),
      stock: product.stock,
      image: product.image,
      description: product.description,
      createdAt: product.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error updating product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = DeleteProductParams.parse(req.params);
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Error deleting product");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
