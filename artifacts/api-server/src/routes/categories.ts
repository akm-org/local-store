import { Router } from "express";
import { store } from "../data/store";

const router = Router();

const CATEGORY_IMAGES: Record<string, string> = {
  Dress: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
  Lifestyle: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop",
  Essentials: "https://images.unsplash.com/photo-1609372332255-611485350f25?w=600&h=600&fit=crop",
  Electronics: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=600&fit=crop",
  Accessories: "https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=600&h=600&fit=crop",
};

router.get("/", (req, res) => {
  try {
    const counts = store.products.categories();
    const categories = ["Dress", "Lifestyle", "Essentials", "Electronics", "Accessories"].map(name => ({
      name,
      count: counts[name] ?? 0,
      image: CATEGORY_IMAGES[name] ?? "",
    }));
    res.json(categories);
  } catch (err) {
    req.log.error({ err }, "Error listing categories");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
