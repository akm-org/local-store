import { useLocation } from "wouter";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useGetCart, useAddToCart, useRemoveFromCart, useClearCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartPage() {
  const [, setLocation] = useLocation();
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useGetCart(
    { userId: user?.id ?? "" },
    { query: { enabled: !!user?.id } }
  );

  const addToCart = useAddToCart({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ userId: user?.id ?? "" }) }),
    },
  });

  const removeFromCart = useRemoveFromCart({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ userId: user?.id ?? "" }) }),
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
        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-xl font-bold mb-2">Your cart is waiting</h1>
        <p className="text-muted-foreground mb-6">Sign in to see your cart</p>
        <Button onClick={() => setLocation("/login")} className="rounded-none">Sign In</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 py-12">
        <Skeleton className="h-8 w-32 mb-8" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-6 border-b">
            <Skeleton className="w-20 h-20 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 py-20 text-center">
        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add something to get started</p>
        <Button onClick={() => setLocation("/shop")} className="rounded-none">Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-20">
      <div className="py-8">
        <h1 className="text-2xl font-black tracking-tight">Your Cart</h1>
        <p className="text-sm text-muted-foreground mt-1">{cart.itemCount} items</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2 space-y-0">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex gap-4 py-6 border-b border-border" data-testid={`cart-item-${item.productId}`}>
              <div className="w-20 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                {item.product?.image && (
                  <img src={item.product.image} alt={item.product?.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm leading-snug" data-testid={`text-cart-name-${item.productId}`}>
                  {item.product?.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.product?.category}</p>
                <p className="font-bold text-sm mt-1" data-testid={`text-cart-price-${item.productId}`}>
                  ₹{item.product ? (item.product.price * item.quantity).toLocaleString("en-IN") : 0}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => removeFromCart.mutate({ productId: item.productId, params: { userId: user!.id } })}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid={`button-remove-${item.productId}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addToCart.mutate({ data: { userId: user!.id, productId: item.productId, quantity: -1 } })}
                    disabled={item.quantity <= 1}
                    className="h-6 w-6 border border-border rounded flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                    data-testid={`button-decrease-${item.productId}`}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm font-medium w-4 text-center" data-testid={`text-qty-${item.productId}`}>{item.quantity}</span>
                  <button
                    onClick={() => addToCart.mutate({ data: { userId: user!.id, productId: item.productId, quantity: 1 } })}
                    className="h-6 w-6 border border-border rounded flex items-center justify-center text-muted-foreground hover:text-foreground"
                    data-testid={`button-increase-${item.productId}`}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <button
              onClick={() => clearCart.mutate({ params: { userId: user!.id } })}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
              data-testid="button-clear-cart"
            >
              Clear cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="border border-border p-6 sticky top-20">
            <h2 className="font-bold mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{cart.total.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span data-testid="text-cart-total">₹{cart.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <Button
              className="w-full mt-6 rounded-none"
              onClick={() => setLocation("/checkout")}
              data-testid="button-checkout"
            >
              Proceed to Checkout
            </Button>
            <Button
              variant="ghost"
              className="w-full mt-2 text-sm"
              onClick={() => setLocation("/shop")}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
