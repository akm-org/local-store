-- LocalStore Database Migration
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/vqduuhfgvuyneztrkfvo/sql/new)

-- 1. Products table
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

-- 2. Users table
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  address text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT ''
);

-- 3. Cart table
CREATE TABLE IF NOT EXISTS cart (
  user_id text NOT NULL,
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, product_id)
);

-- 4. Orders table
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

-- 5. Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  user_id text NOT NULL,
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, product_id)
);

-- 6. Settings table
CREATE TABLE IF NOT EXISTS settings (
  id integer PRIMARY KEY DEFAULT 1,
  upi_id text NOT NULL DEFAULT 'localstore@upi',
  qr_image text NOT NULL DEFAULT '',
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO settings (id, upi_id, qr_image) VALUES (1, 'localstore@upi', '')
ON CONFLICT (id) DO NOTHING;

-- 7. Seed products
INSERT INTO products (id, name, category, price, stock, image, description, created_at) VALUES
  ('PDRESS001', 'Floral Wrap Dress', 'Dress', 1299, 25, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80', 'Elegant floral wrap dress perfect for summer occasions.', '2024-01-01T00:00:00.000Z'),
  ('PDRESS002', 'Classic Black Dress', 'Dress', 1899, 18, 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80', 'Timeless little black dress for every wardrobe.', '2024-01-02T00:00:00.000Z'),
  ('PDRESS003', 'Boho Maxi Dress', 'Dress', 2199, 12, 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80', 'Free-flowing boho maxi dress with floral prints.', '2024-01-03T00:00:00.000Z'),
  ('PDRESS004', 'Cocktail Party Dress', 'Dress', 2799, 10, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80', 'Elegant cocktail dress for special occasions.', '2024-01-04T00:00:00.000Z'),
  ('PLIFE001', 'Casual Denim Jacket', 'Lifestyle', 1799, 30, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80', 'Classic denim jacket for everyday style.', '2024-01-05T00:00:00.000Z'),
  ('PLIFE002', 'Linen Summer Shirt', 'Lifestyle', 899, 40, 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80', 'Breathable linen shirt for warm days.', '2024-01-06T00:00:00.000Z'),
  ('PLIFE003', 'Relaxed Fit Joggers', 'Lifestyle', 1099, 35, 'https://images.unsplash.com/photo-1542596594-649edbc13630?w=600&q=80', 'Comfortable joggers for casual wear.', '2024-01-07T00:00:00.000Z'),
  ('PESS001', 'Cotton White T-Shirt', 'Essentials', 499, 60, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80', 'Premium cotton essential white tee.', '2024-01-08T00:00:00.000Z'),
  ('PESS002', 'Classic Blue Jeans', 'Essentials', 1599, 45, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80', 'Slim fit blue jeans for everyday wear.', '2024-01-09T00:00:00.000Z'),
  ('PESS003', 'Basic Black Leggings', 'Essentials', 699, 50, 'https://images.unsplash.com/photo-1583342788075-93a0c18ceef9?w=600&q=80', 'Stretchy and comfortable black leggings.', '2024-01-10T00:00:00.000Z'),
  ('PELEC001', 'Wireless Earbuds', 'Electronics', 2499, 20, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', 'Premium wireless earbuds with noise cancellation.', '2024-01-11T00:00:00.000Z'),
  ('PELEC002', 'Smart Watch', 'Electronics', 4999, 15, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', 'Feature-packed smart watch with health tracking.', '2024-01-12T00:00:00.000Z'),
  ('PELEC003', 'Bluetooth Speaker', 'Electronics', 1999, 22, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80', 'Portable bluetooth speaker with 12-hour battery.', '2024-01-13T00:00:00.000Z'),
  ('PACC001', 'Leather Handbag', 'Accessories', 2299, 18, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', 'Genuine leather handbag with multiple compartments.', '2024-01-14T00:00:00.000Z'),
  ('PACC002', 'Silk Scarf', 'Accessories', 799, 30, 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80', 'Luxurious silk scarf with vibrant prints.', '2024-01-15T00:00:00.000Z'),
  ('PACC003', 'Gold Hoop Earrings', 'Accessories', 599, 40, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80', 'Classic gold hoop earrings for everyday elegance.', '2024-01-16T00:00:00.000Z')
ON CONFLICT (id) DO NOTHING;

-- 8. Disable Row Level Security for all tables (since we use service role key)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
