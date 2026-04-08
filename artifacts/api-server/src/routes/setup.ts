import { Router } from "express";
import pg from "pg";
import productsData from "../data/products.json" assert { type: "json" };

const router = Router();

const DDL = `
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  price numeric(10,2) NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  image text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  address text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS cart (
  user_id text NOT NULL,
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  user_name text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  amount numeric(10,2) NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  utr text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS wishlist (
  user_id text NOT NULL,
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS settings (
  id integer PRIMARY KEY DEFAULT 1,
  upi_id text NOT NULL DEFAULT 'localstore@upi',
  qr_image text NOT NULL DEFAULT '',
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO settings (id, upi_id, qr_image) VALUES (1, 'localstore@upi', '')
ON CONFLICT (id) DO NOTHING;
`;

router.post("/setup", async (req, res) => {
  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    return res.status(500).json({ error: "SUPABASE_DB_URL not configured" });
  }

  const pool = new pg.Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    await pool.query(DDL);

    const products = productsData as Array<{
      id: string; name: string; category: string; price: number; stock: number;
      image: string; description: string; createdAt: string;
    }>;

    let inserted = 0;
    for (const p of products) {
      await pool.query(
        `INSERT INTO products (id, name, category, price, stock, image, description, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO NOTHING`,
        [p.id, p.name, p.category, p.price, p.stock, p.image, p.description, p.createdAt]
      );
      inserted++;
    }

    await pool.end();
    res.json({ ok: true, message: "Tables created and products seeded", productsInserted: inserted });
  } catch (err: any) {
    await pool.end().catch(() => {});
    res.status(500).json({ error: err.message });
  }
});

export default router;
