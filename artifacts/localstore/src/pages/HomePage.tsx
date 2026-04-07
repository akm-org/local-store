import { Link, useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { data: products, isLoading: productsLoading } = useListProducts({ sort: "newest" });
  const { data: categories, isLoading: catsLoading } = useListCategories();

  const featured = products?.slice(0, 8) ?? [];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-14 min-h-[80vh] sm:min-h-[90vh] flex flex-col justify-center border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-32">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4 sm:mb-6">New Season Collection</p>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black leading-none tracking-tight mb-6 sm:mb-8">
              JUST<br />YOUR<br />STYLE.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-sm leading-relaxed">
              Quality products curated for modern living. Dress, lifestyle, essentials and more — delivered to your door.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <Button
                size="lg"
                onClick={() => setLocation("/shop")}
                className="rounded-none px-5 sm:px-8 text-sm sm:text-base"
                data-testid="button-shop-now"
              >
                Shop Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setLocation("/shop?category=Dress")}
                className="rounded-none px-5 sm:px-8 text-sm sm:text-base"
                data-testid="button-explore"
              >
                Explore
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black tracking-tight">Shop by Category</h2>
          <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            All Products <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {catsLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))
            : categories?.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/shop?category=${cat.name}`}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
                  data-testid={`link-category-card-${cat.name.toLowerCase()}`}
                >
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <p className="text-white font-black text-sm tracking-tight">{cat.name.toUpperCase()}</p>
                    <p className="text-white/70 text-xs">{cat.count} items</p>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black tracking-tight">New Arrivals</h2>
          <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8">
          {productsLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-lg" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            : featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* Banner */}
      <section className="border-t border-b border-border bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-xs font-medium uppercase tracking-widest mb-4 opacity-60">Quality Guaranteed</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">Dress the part.<br />Live the part.</h2>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setLocation("/shop")}
            className="rounded-none border-background text-background hover:bg-background hover:text-foreground px-8"
          >
            Shop Collection
          </Button>
        </div>
      </section>
    </div>
  );
}
