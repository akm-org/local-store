import rawProductsData from "./products.json";
import rawSettingsData from "./settings.json";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
}

export interface CartItem {
  userId: string;
  productId: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  amount: number;
  address: string;
  phone: string;
  utr: string;
  status: string;
  createdAt: string;
}

export interface WishlistItem {
  userId: string;
  productId: string;
}

export interface Settings {
  upiId: string;
  qrImage: string;
}

function genId(prefix: string) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
}

let products: Product[] = (rawProductsData as Product[]).map(p => ({ ...p }));
let users: User[] = [];
let cart: CartItem[] = [];
let orders: Order[] = [];
let wishlist: WishlistItem[] = [];
let settings: Settings = { ...(rawSettingsData as Settings) };

export const store = {
  products: {
    list(params: { category?: string; search?: string; minPrice?: number; maxPrice?: number; sort?: string }) {
      let result = [...products];
      if (params.category) result = result.filter(p => p.category === params.category);
      if (params.search) result = result.filter(p => p.name.toLowerCase().includes(params.search!.toLowerCase()));
      if (params.minPrice !== undefined) result = result.filter(p => p.price >= params.minPrice!);
      if (params.maxPrice !== undefined) result = result.filter(p => p.price <= params.maxPrice!);
      if (params.sort === "price_asc") result.sort((a, b) => a.price - b.price);
      else if (params.sort === "price_desc") result.sort((a, b) => b.price - a.price);
      else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return result;
    },
    get(id: string) { return products.find(p => p.id === id) ?? null; },
    create(data: Omit<Product, "id" | "createdAt">) {
      const p: Product = { ...data, id: `P${genId("R")}`, createdAt: new Date().toISOString() };
      products.unshift(p);
      return p;
    },
    update(id: string, data: Partial<Omit<Product, "id" | "createdAt">>) {
      const idx = products.findIndex(p => p.id === id);
      if (idx === -1) return null;
      products[idx] = { ...products[idx], ...data };
      return products[idx];
    },
    delete(id: string) { products = products.filter(p => p.id !== id); },
    categories() {
      const counts: Record<string, number> = {};
      for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1;
      return counts;
    },
  },

  users: {
    get(id: string) { return users.find(u => u.id === id) ?? null; },
    getByEmail(email: string) { return users.find(u => u.email === email) ?? null; },
    create(data: Omit<User, "id">) {
      const u: User = { ...data, id: genId("U") };
      users.push(u);
      return u;
    },
  },

  cart: {
    get(userId: string) { return cart.filter(c => c.userId === userId); },
    add(userId: string, productId: string, quantity: number) {
      const existing = cart.find(c => c.userId === userId && c.productId === productId);
      if (existing) { existing.quantity += quantity; return existing; }
      const item: CartItem = { userId, productId, quantity };
      cart.push(item);
      return item;
    },
    remove(userId: string, productId: string) {
      cart = cart.filter(c => !(c.userId === userId && c.productId === productId));
    },
    clear(userId: string) { cart = cart.filter(c => c.userId !== userId); },
  },

  orders: {
    list(userId?: string) {
      const all = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return userId ? all.filter(o => o.userId === userId) : all;
    },
    get(id: string) { return orders.find(o => o.id === id) ?? null; },
    create(data: Omit<Order, "id" | "createdAt" | "status">) {
      const o: Order = { ...data, id: genId("O"), status: "Pending", createdAt: new Date().toISOString() };
      orders.unshift(o);
      return o;
    },
    updateStatus(id: string, status: string, utr?: string) {
      const o = orders.find(o => o.id === id);
      if (!o) return null;
      o.status = status;
      if (utr !== undefined) o.utr = utr;
      return o;
    },
  },

  wishlist: {
    get(userId: string) { return wishlist.filter(w => w.userId === userId).map(w => w.productId); },
    toggle(userId: string, productId: string) {
      const idx = wishlist.findIndex(w => w.userId === userId && w.productId === productId);
      if (idx !== -1) { wishlist.splice(idx, 1); return false; }
      wishlist.push({ userId, productId });
      return true;
    },
  },

  settings: {
    get() { return { ...settings }; },
    update(data: Partial<Settings>) { settings = { ...settings, ...data }; return settings; },
  },

  stats() {
    const allOrders = orders;
    const totalRevenue = allOrders.filter(o => o.status !== "Pending" && o.status !== "Cancelled")
      .reduce((s, o) => s + o.amount, 0);
    return {
      totalProducts: products.length,
      totalOrders: allOrders.length,
      totalUsers: users.length,
      totalRevenue,
      pendingOrders: allOrders.filter(o => o.status === "Pending").length,
      recentOrders: allOrders.slice(0, 5),
    };
  },
};
