import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useListOrders, useUpdateOrderStatus, getListOrdersQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const [, setLocation] = useLocation();
  const { isAdmin, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders, isLoading } = useListOrders({});

  const updateStatus = useUpdateOrderStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey({}) });
        toast({ title: "Order status updated" });
      },
      onError: () => toast({ title: "Failed to update status", variant: "destructive" }),
    },
  });

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 py-20 text-center">
        <p className="text-muted-foreground mb-4">Admin access required</p>
        <Button onClick={() => setLocation("/admin/login")} className="rounded-none">Admin Login</Button>
      </div>
    );
  }

  const filtered = statusFilter === "all" ? orders : orders?.filter(o => o.status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-20">
      <div className="py-8">
        <button
          onClick={() => setLocation("/admin")}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Orders</h1>
            <p className="text-sm text-muted-foreground mt-1">{filtered?.length ?? 0} orders</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 rounded-none" data-testid="select-status-filter">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : filtered?.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">No orders found</div>
      ) : (
        <div className="space-y-4">
          {filtered?.map((order) => (
            <div key={order.id} className="border border-border p-5" data-testid={`admin-order-${order.id}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8)}</p>
                  <p className="text-sm font-medium mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  {order.utr && (
                    <p className="text-xs text-muted-foreground mt-0.5">UTR: <span className="font-mono">{order.utr}</span></p>
                  )}
                </div>
                <Select
                  value={order.status}
                  onValueChange={(v) => updateStatus.mutate({ id: order.id, data: { status: v as any, trackingId: order.trackingId ?? "" } })}
                >
                  <SelectTrigger className={`w-36 rounded-none text-xs h-8 ${STATUS_COLORS[order.status] ?? ""}`} data-testid={`select-order-status-${order.id}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 mb-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.productName} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  {order.address && <p className="text-xs text-muted-foreground">{order.address}</p>}
                  {order.phone && <p className="text-xs text-muted-foreground">{order.phone}</p>}
                </div>
                <p className="font-bold" data-testid={`text-admin-order-amount-${order.id}`}>₹{order.amount.toLocaleString("en-IN")}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
