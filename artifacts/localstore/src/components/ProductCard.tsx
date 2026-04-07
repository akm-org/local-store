import { Link } from "wouter";
import { Heart, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAddToCart, useToggleWishlist, useGetWishlist, getGetCartQueryKey, getGetWishlistQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wishlist } = useGetWishlist(
    { userId: user?.id ?? "" },
    { query: { enabled: !!user?.id } }
  );

  const isWishlisted = wishlist?.productIds?.includes(product.id) ?? false;

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast({ title: "Sign in to add to cart", variant: "destructive" });
      return;
    }
    if (product.stock === 0) return;
    addToCart.mutate({ data: { userId: user!.id, productId: product.id, quantity: 1 } });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast({ title: "Sign in to save items", variant: "destructive" });
      return;
    }
    toggleWishlist.mutate({ data: { userId: user!.id, productId: product.id } });
  };

  return (
    <Link href={`/product/${product.id}`} data-testid={`card-product-${product.id}`}>
      <div className="group relative">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted rounded-lg mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="secondary">Out of Stock</Badge>
            </div>
          )}
          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            data-testid={`button-wishlist-${product.id}`}
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? "fill-foreground text-foreground" : "text-foreground"}`}
            />
          </button>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{product.category}</p>
          <p className="font-medium text-sm leading-snug line-clamp-1" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </p>
          <div className="flex items-center justify-between">
            <p className="font-bold text-sm" data-testid={`text-price-${product.id}`}>
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addToCart.isPending}
              className="h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-40 hover:opacity-80 transition-opacity"
              data-testid={`button-add-cart-${product.id}`}
            >
              <ShoppingCart className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
