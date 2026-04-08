import { useLocation } from "wouter";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { useListOrders, useListProducts } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
};

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { isAdmin, isLoggedIn } = useAuth();

  const { data: rawOrders, isLoading: ordersLoading } = useListOrders({});
  const { data: rawProducts, isLoading: productsLoading } = useListProducts({});
  const orders = Array.isArray(rawOrders) ? rawOrders : [];
  const products = Array.isArray(rawProducts) ? rawProducts : [];

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 py-20 text-center">
        <p className="text-muted-foreground mb-4">Admin access required</p>
        <Button onClick={() => setLocation("/admin/login")} className="rounded-none">Admin Login</Button>
      </div>
    );
  }

  const totalRevenue = orders.filter(o => o.status !== "Cancelled").reduce((sum, o) => sum + o.amount, 0);
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const totalProducts = products.length;
  const totalOrders = orders.length;

  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: TrendingUp },
    { label: "Total Orders", value: totalOrders, icon: ShoppingCart },
    { label: "Pending", value: pendingOrders, icon: Package },
    { label: "Products", value: totalProducts, icon: Package },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-20">
      <div className="py-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">Admin</p>
        <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
      </div>

      {/* Quick nav */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {[
          { label: "Products", path: "/admin/products" },
          { label: "Orders", path: "/admin/orders" },
          { label: "Payment", path: "/admin/payment" },
        ].map((item) => (
          <Button
            key={item.path}
            variant="outline"
            size="sm"
            className="rounded-none"
            onClick={() => setLocation(item.path)}
            data-testid={`button-nav-${item.label.toLowerCase()}`}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-border p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{stat.label}</p>
            {ordersLoading || productsLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <p className="text-2xl font-black" data-testid={`stat-${stat.label.toLowerCase().replace(" ", "-")}`}>
                {stat.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold uppercase tracking-wider text-xs">Recent Orders</h2>
          <Button variant="ghost" size="sm" onClick={() => setLocation("/admin/orders")}>View all</Button>
        </div>
        <div className="border border-border divide-y divide-border">
          {ordersLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))
          ) : recentOrders.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No orders yet</div>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between" data-testid={`dashboard-order-${order.id}`}>
                <div>
                  <p className="text-sm font-mono">{order.id.slice(0, 8)}...</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLORS[order.status] ?? "bg-muted"}`}>
                    {order.status}
                  </span>
                  <p className="text-sm font-medium">₹{order.amount.toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
