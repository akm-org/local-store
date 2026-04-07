import { useState } from "react";
import { useLocation } from "wouter";
import { useGetCart, useCreateOrder, useGetPaymentQR, useClearCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [address, setAddress] = useState(user?.address ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [utr, setUtr] = useState("");

  const { data: cart, isLoading: cartLoading } = useGetCart(
    { userId: user?.id ?? "" },
    { query: { enabled: !!user?.id } }
  );
  const { data: qr } = useGetPaymentQR();

  const createOrder = useCreateOrder({
    mutation: {
      onSuccess: (order) => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ userId: user?.id ?? "" }) });
        clearCart.mutate({ params: { userId: user!.id } });
        toast({ title: "Order placed successfully!" });
        setLocation(`/orders`);
      },
      onError: () => {
        toast({ title: "Failed to place order", variant: "destructive" });
      },
    },
  });

  const clearCart = useClearCart({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ userId: user?.id ?? "" }) }),
    },
  });

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 py-20 text-center">
        <p className="text-muted-foreground mb-4">Sign in to checkout</p>
        <Button onClick={() => setLocation("/login")} className="rounded-none">Sign In</Button>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 py-12">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid lg:grid-cols-2 gap-12">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 py-20 text-center">
        <p className="text-muted-foreground mb-4">Your cart is empty</p>
        <Button onClick={() => setLocation("/shop")} className="rounded-none">Continue Shopping</Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !phone || !utr) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    createOrder.mutate({
      data: {
        userId: user!.id,
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product?.price ?? 0,
          productName: item.product?.name ?? "",
        })),
        amount: cart.total,
        address,
        phone,
        utr,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-20">
      <div className="py-8">
        <h1 className="text-2xl font-black tracking-tight">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Form */}
          <div className="space-y-8">
            {/* Delivery */}
            <div>
              <h2 className="font-bold text-sm uppercase tracking-widest mb-5">Delivery Details</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs uppercase tracking-wider" htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Full delivery address"
                    className="mt-1 rounded-none"
                    required
                    data-testid="input-address"
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider" htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contact number"
                    className="mt-1 rounded-none"
                    required
                    data-testid="input-phone"
                  />
                </div>
              </div>
            </div>

            {/* Payment QR */}
            <div>
              <h2 className="font-bold text-sm uppercase tracking-widest mb-5">Payment via QR</h2>
              <div className="border border-border p-6 text-center">
                {qr?.qrUrl ? (
                  <div>
                    <img
                      src={qr.qrUrl}
                      alt="Payment QR"
                      className="w-48 h-48 mx-auto object-contain mb-4"
                      data-testid="img-payment-qr"
                    />
                    <p className="text-xs text-muted-foreground">Scan and pay ₹{cart.total.toLocaleString("en-IN")}</p>
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="w-48 h-48 bg-muted mx-auto mb-4 flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">QR not configured</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Contact shop for payment details</p>
                  </div>
                )}
                <div className="mt-4">
                  <Label className="text-xs uppercase tracking-wider" htmlFor="utr">UTR / Transaction ID</Label>
                  <Input
                    id="utr"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="Enter transaction reference"
                    className="mt-1 rounded-none text-center"
                    required
                    data-testid="input-utr"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div>
            <h2 className="font-bold text-sm uppercase tracking-widest mb-5">Order Summary</h2>
            <div className="border border-border">
              <div className="divide-y divide-border">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex gap-3 p-4" data-testid={`checkout-item-${item.productId}`}>
                    <div className="w-12 h-12 bg-muted overflow-hidden flex-shrink-0">
                      {item.product?.image && (
                        <img src={item.product.image} alt={item.product?.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.product?.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">₹{item.product ? (item.product.price * item.quantity).toLocaleString("en-IN") : 0}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cart.total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span data-testid="text-checkout-total">₹{cart.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-6 rounded-none h-12"
              disabled={createOrder.isPending}
              data-testid="button-place-order"
            >
              {createOrder.isPending ? "Placing Order..." : "Place Order"}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Order will be confirmed after payment verification
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
