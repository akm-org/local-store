import { useLocation } from "wouter";
import { Heart } from "lucide-react";
import { useGetWishlist, useListProducts } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const [, setLocation] = useLocation();
  const { user, isLoggedIn } = useAuth();

  const { data: wishlist, isLoading: wishlistLoading } = useGetWishlist(
    { userId: user?.id ?? "" },
    { query: { enabled: !!user?.id } }
  );

  const { data: rawAllProducts, isLoading: productsLoading } = useListProducts({});

  const isLoading = wishlistLoading || productsLoading;
  const allProducts = Array.isArray(rawAllProducts) ? rawAllProducts : [];
  const wishlistProducts = allProducts.filter(p => wishlist?.productIds?.includes(p.id));

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 py-20 text-center">
        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-xl font-bold mb-2">Sign in to view wishlist</h1>
        <Button onClick={() => setLocation("/login")} className="rounded-none mt-4">Sign In</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-20">
      <div className="py-8">
        <h1 className="text-2xl font-black tracking-tight">Wishlist</h1>
        <p className="text-sm text-muted-foreground mt-1">{wishlistProducts.length} saved items</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-lg" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="py-20 text-center">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No saved items yet</p>
          <Button onClick={() => setLocation("/shop")} className="rounded-none">Browse Products</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
