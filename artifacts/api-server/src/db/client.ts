import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars");
}

function isTableMissingError(error: any): boolean {
  return error && (error.code === "PGRST205" || (error.message && error.message.includes("schema cache")));
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

function genId(prefix: string) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
}

export const db = {
  products: {
    async list(params: { category?: string; search?: string; minPrice?: number; maxPrice?: number; sort?: string }) {
      let query = supabase.from("products").select("*");
      if (params.category) query = query.eq("category", params.category);
      if (params.search) query = query.ilike("name", `%${params.search}%`);
      if (params.minPrice !== undefined) query = query.gte("price", params.minPrice);
      if (params.maxPrice !== undefined) query = query.lte("price", params.maxPrice);
      if (params.sort === "price_asc") query = query.order("price", { ascending: true });
      else if (params.sort === "price_desc") query = query.order("price", { ascending: false });
      else query = query.order("created_at", { ascending: false });
      const { data, error } = await query;
      if (error) { if (isTableMissingError(error)) return []; throw error; }
      return (data ?? []).map(normalizeProduct);
    },
    async get(id: string) {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? normalizeProduct(data) : null;
    },
    async create(input: { name: string; category: string; price: number; stock: number; image: string; description: string }) {
      const id = `P${genId("R")}`;
      const { data, error } = await supabase.from("products").insert({ id, ...input }).select().single();
      if (error) throw error;
      return normalizeProduct(data);
    },
    async update(id: string, input: Partial<{ name: string; category: string; price: number; stock: number; image: string; description: string }>) {
      const { data, error } = await supabase.from("products").update(input).eq("id", id).select().maybeSingle();
      if (error) throw error;
      return data ? normalizeProduct(data) : null;
    },
    async delete(id: string) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    async categories() {
      const { data, error } = await supabase.from("products").select("category");
      if (error) { if (isTableMissingError(error)) return {}; throw error; }
      const counts: Record<string, number> = {};
      for (const row of data ?? []) {
        counts[row.category] = (counts[row.category] ?? 0) + 1;
      }
      return counts;
    },
  },

  users: {
    async get(id: string) {
      const { data, error } = await supabase.from("users").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
    async getByEmail(email: string) {
      const { data, error } = await supabase.from("users").select("*").eq("email", email).maybeSingle();
      if (error) throw error;
      return data;
    },
    async create(input: { name: string; email: string; password: string; address: string; phone: string }) {
      const id = genId("U");
      const { data, error } = await supabase.from("users").insert({ id, ...input }).select().single();
      if (error) throw error;
      return data;
    },
  },

  cart: {
    async get(userId: string) {
      const { data, error } = await supabase
        .from("cart")
        .select("product_id, quantity, products(*)")
        .eq("user_id", userId);
      if (error) throw error;
      return (data ?? []).map((row: any) => ({
        productId: row.product_id,
        quantity: row.quantity,
        product: row.products ? normalizeProduct(row.products) : null,
      }));
    },
    async add(userId: string, productId: string, quantity: number) {
      const { data: existing } = await supabase
        .from("cart")
        .select("quantity")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .maybeSingle();
      if (existing) {
        const newQty = existing.quantity + quantity;
        await supabase.from("cart").update({ quantity: newQty }).eq("user_id", userId).eq("product_id", productId);
      } else {
        await supabase.from("cart").insert({ user_id: userId, product_id: productId, quantity });
      }
    },
    async remove(userId: string, productId: string) {
      const { error } = await supabase.from("cart").delete().eq("user_id", userId).eq("product_id", productId);
      if (error) throw error;
    },
    async clear(userId: string) {
      const { error } = await supabase.from("cart").delete().eq("user_id", userId);
      if (error) throw error;
    },
  },

  orders: {
    async list(userId?: string) {
      let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (userId) query = query.eq("user_id", userId);
      const { data, error } = await query;
      if (error) { if (isTableMissingError(error)) return []; throw error; }
      return (data ?? []).map(normalizeOrder);
    },
    async get(id: string) {
      const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? normalizeOrder(data) : null;
    },
    async create(input: { userId: string; userName: string; items: any[]; amount: number; address: string; phone: string; utr: string }) {
      const id = genId("O");
      const row = {
        id,
        user_id: input.userId,
        user_name: input.userName,
        items: input.items,
        amount: input.amount,
        address: input.address,
        phone: input.phone,
        utr: input.utr,
        status: "Pending",
      };
      const { data, error } = await supabase.from("orders").insert(row).select().single();
      if (error) throw error;
      return normalizeOrder(data);
    },
    async updateStatus(id: string, status: string, utr?: string) {
      const update: any = { status };
      if (utr !== undefined) update.utr = utr;
      const { data, error } = await supabase.from("orders").update(update).eq("id", id).select().maybeSingle();
      if (error) throw error;
      return data ? normalizeOrder(data) : null;
    },
  },

  wishlist: {
    async get(userId: string) {
      const { data, error } = await supabase.from("wishlist").select("product_id").eq("user_id", userId);
      if (error) { if (isTableMissingError(error)) return []; throw error; }
      return (data ?? []).map((r: any) => r.product_id);
    },
    async toggle(userId: string, productId: string) {
      const { data: existing } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .maybeSingle();
      if (existing) {
        await supabase.from("wishlist").delete().eq("user_id", userId).eq("product_id", productId);
        return false;
      } else {
        await supabase.from("wishlist").insert({ user_id: userId, product_id: productId });
        return true;
      }
    },
  },

  settings: {
    async get() {
      const { data, error } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
      if (isTableMissingError(error)) return { upiId: "localstore@upi", qrImage: "" };
      return { upiId: data?.upi_id ?? "localstore@upi", qrImage: data?.qr_image ?? "" };
    },
    async update(input: Partial<{ upiId: string; qrImage: string }>) {
      const update: any = {};
      if (input.upiId !== undefined) update.upi_id = input.upiId;
      if (input.qrImage !== undefined) update.qr_image = input.qrImage;
      const { data, error } = await supabase.from("settings").upsert({ id: 1, ...update }).select().single();
      if (error) throw error;
      return { upiId: data.upi_id, qrImage: data.qr_image };
    },
  },

  async stats() {
    const [productsRes, usersRes, ordersRes] = await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("users").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
    ]);
    if (isTableMissingError(productsRes.error) || isTableMissingError(ordersRes.error)) {
      return { totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0, pendingOrders: 0, recentOrders: [] };
    }
    const allOrders = (ordersRes.data ?? []).map(normalizeOrder);
    const totalRevenue = allOrders
      .filter((o) => o.status !== "Pending" && o.status !== "Cancelled")
      .reduce((s, o) => s + o.amount, 0);
    return {
      totalProducts: productsRes.count ?? 0,
      totalOrders: allOrders.length,
      totalUsers: usersRes.count ?? 0,
      totalRevenue,
      pendingOrders: allOrders.filter((o) => o.status === "Pending").length,
      recentOrders: allOrders.slice(0, 5),
    };
  },
};

function normalizeProduct(row: any) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    stock: row.stock,
    image: row.image,
    description: row.description ?? "",
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

function normalizeOrder(row: any) {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    items: Array.isArray(row.items) ? row.items : [],
    amount: Number(row.amount),
    address: row.address,
    phone: row.phone,
    utr: row.utr ?? "",
    status: row.status,
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}
