import { Router } from "express";
import { store } from "../data/store";
import { CreateProductBody, ListProductsQueryParams, GetProductParams, UpdateProductParams, UpdateProductBody, DeleteProductParams } from "@workspace/api-zod";

const router = Router();

router.get("/", (req, res) => {
  try {
    const query = ListProductsQueryParams.parse(req.query);
    const products = store.products.list({
      category: query.category,
      search: query.search,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      sort: query.sort,
    });
    res.json(products);
  } catch (err) {
    req.log.error({ err }, "Error listing products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", (req, res) => {
  try {
    const body = CreateProductBody.parse(req.body);
    const product = store.products.create({
      name: body.name,
      category: body.category,
      price: body.price,
      stock: body.stock,
      image: body.image ?? "",
      description: body.description ?? "",
    });
    res.status(201).json(product);
  } catch (err) {
    req.log.error({ err }, "Error creating product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", (req, res) => {
  try {
    const { id } = GetProductParams.parse(req.params);
    const product = store.products.get(id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
    req.log.error({ err }, "Error getting product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", (req, res) => {
  try {
    const { id } = UpdateProductParams.parse(req.params);
    const body = UpdateProductBody.parse(req.body);
    const product = store.products.update(id, {
      name: body.name,
      category: body.category,
      price: body.price,
      stock: body.stock,
      image: body.image ?? "",
      description: body.description ?? "",
    });
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
    req.log.error({ err }, "Error updating product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const { id } = DeleteProductParams.parse(req.params);
    store.products.delete(id);
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Error deleting product");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
