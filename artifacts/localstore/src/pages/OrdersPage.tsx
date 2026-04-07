import { useLocation } from "wouter";
import { Package, ChevronRight } from "lucide-react";
import { useListOrders } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  Shipped: "bg-purple-100 text-purple-800 border-purple-200",
  Delivered: "bg-green-100 text-green-800 border-green-200",
};

export default function OrdersPage() {
  const [, setLocation] = useLocation();
  const { user, isLoggedIn } = useAuth();

  const { data: orders, isLoading } = useListOrders(
    { userId: user?.id },
    { query: { enabled: !!user?.id } }
  );

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 py-20 text-center">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-xl font-bold mb-2">Sign in to view orders</h1>
        <Button onClick={() => setLocation("/login")} className="rounded-none mt-4">Sign In</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-20">
      <div className="py-8">
        <h1 className="text-2xl font-black tracking-tight">My Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">{orders?.length ?? 0} orders</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-border p-6">
              <div className="flex justify-between mb-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      ) : orders?.length === 0 ? (
        <div className="py-20 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No orders yet</p>
          <Button onClick={() => setLocation("/shop")} className="rounded-none">Start Shopping</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders?.map((order) => (
            <div key={order.id} className="border border-border p-6" data-testid={`order-${order.id}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Order ID</p>
                  <p className="font-mono text-sm font-medium" data-testid={`text-order-id-${order.id}`}>{order.id}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded border font-medium ${STATUS_COLORS[order.status] ?? "bg-muted"}`} data-testid={`status-${order.id}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.productName} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  {order.trackingId && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Tracking: <span className="font-mono">{order.trackingId}</span>
                    </p>
                  )}
                </div>
                <p className="font-bold" data-testid={`text-order-amount-${order.id}`}>₹{order.amount.toLocaleString("en-IN")}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
