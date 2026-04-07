import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Heart, ShoppingCart, Package } from "lucide-react";
import { useGetProduct, useAddToCart, useToggleWishlist, useGetWishlist, getGetCartQueryKey, getGetWishlistQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductPage() {
  const [match, params] = useRoute("/product/:id");
  const [, setLocation] = useLocation();
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useGetProduct(params?.id ?? "", {
    query: { enabled: !!params?.id }
  });

  const { data: wishlist } = useGetWishlist(
    { userId: user?.id ?? "" },
    { query: { enabled: !!user?.id } }
  );

  const isWishlisted = wishlist?.productIds?.includes(params?.id ?? "") ?? false;

  const addToCart = useAddToCart({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ userId: user?.id ?? "" }) });
        toast({ title: "Added to cart" });
      },
    },
  });

  const toggleWishlist = useToggleWishlist({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey({ userId: user?.id ?? "" }) });
      },
    },
  });

  const handleAddToCart = () => {
    if (!isLoggedIn) { setLocation("/login"); return; }
    if (!product || product.stock === 0) return;
    addToCart.mutate({ data: { userId: user!.id, productId: product.id, quantity: 1 } });
  };

  const handleWishlist = () => {
    if (!isLoggedIn) { setLocation("/login"); return; }
    if (!product) return;
    toggleWishlist.mutate({ data: { userId: user!.id, productId: product.id } });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-20">
        <div className="grid md:grid-cols-2 gap-12 py-12">
          <Skeleton className="aspect-square rounded-none" />
          <div className="space-y-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 py-20 text-center">
        <p className="text-muted-foreground mb-4">Product not found</p>
        <Button onClick={() => setLocation("/shop")} variant="outline" className="rounded-none">Back to Shop</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-20">
      {/* Back */}
      <div className="py-6">
        <button
          onClick={() => setLocation("/shop")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-back"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square rounded-none overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            data-testid="img-product"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl font-black tracking-tight mb-3" data-testid="text-product-name">
              {product.name}
            </h1>
            <p className="text-2xl font-bold" data-testid="text-product-price">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            {product.stock > 0 ? (
              <span className="text-sm text-muted-foreground" data-testid="text-stock">
                {product.stock} in stock
              </span>
            ) : (
              <Badge variant="secondary" data-testid="badge-out-of-stock">Out of Stock</Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed" data-testid="text-description">
            {product.description}
          </p>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addToCart.isPending}
              className="flex-1 rounded-none"
              data-testid="button-add-to-cart"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleWishlist}
              className="rounded-none px-4"
              data-testid="button-wishlist"
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-foreground" : ""}`} />
            </Button>
          </div>

          {/* Trust signals */}
          <div className="border-t border-border pt-6 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>Secure QR Payment</div>
            <div>Fast Delivery</div>
            <div>Easy Returns</div>
            <div>Quality Guaranteed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
