import { Link, useLocation } from "wouter";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=85",
];

const PROMO_BANNERS = [
  {
    title: "NEW ARRIVALS",
    subtitle: "DRESS",
    desc: "Bold, fresh, and made for movement.",
    cta: "Shop Dress",
    href: "/shop?category=Dress",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    dark: true,
  },
  {
    title: "JUST IN",
    subtitle: "ACCESSORIES",
    desc: "The details that define you.",
    cta: "Shop Accessories",
    href: "/shop?category=Accessories",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    dark: false,
  },
];

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { data: rawProducts, isLoading: productsLoading } = useListProducts({ sort: "newest" });
  const { data: rawCategories, isLoading: catsLoading } = useListCategories();

  const products = Array.isArray(rawProducts) ? rawProducts : [];
  const categories = Array.isArray(rawCategories) ? rawCategories : [];
  const featured = products.slice(0, 8);

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="relative pt-14 min-h-[70vh] sm:min-h-[80vh] landscape:min-h-[100vh] flex items-end overflow-hidden bg-black">
        <img
          src={HERO_IMAGES[0]}
          alt="New Season Collection"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
          loading="eager"
        />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pb-10 sm:pb-16 landscape:pb-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/70 mb-3">
            New Season · 2026
          </p>
          <h1 className="text-5xl sm:text-7xl md:text-9xl landscape:text-6xl font-black leading-none tracking-tight text-white mb-4 sm:mb-6">
            JUST<br className="sm:hidden" /> YOUR<br className="sm:hidden" /> STYLE.
          </h1>
          <p className="text-sm sm:text-base text-white/80 mb-6 sm:mb-8 max-w-xs sm:max-w-sm leading-relaxed landscape:hidden">
            Quality products curated for modern living — delivered to your door.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => setLocation("/shop")}
              className="rounded-none bg-white text-black hover:bg-white/90 px-6 sm:px-10 text-sm sm:text-base font-bold"
            >
              Shop Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/shop?category=Dress")}
              className="rounded-none border-white text-white hover:bg-white/10 px-6 sm:px-10 text-sm sm:text-base"
            >
              Explore
            </Button>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="bg-foreground text-background overflow-hidden py-2.5">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite]">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-4 text-xs font-bold uppercase tracking-widest">
              <span>Free Shipping on ₹999+</span>
              <span className="opacity-40">·</span>
              <span>New Arrivals Daily</span>
              <span className="opacity-40">·</span>
              <span>100+ Products</span>
              <span className="opacity-40">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section className="py-10 sm:py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase">Shop by Category</h2>
            <Link href="/shop" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors font-medium">
              All Products <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 sm:grid sm:grid-cols-3 md:grid-cols-5 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {catsLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-36 sm:w-auto">
                    <Skeleton className="aspect-[3/4] sm:aspect-square rounded-lg" />
                  </div>
                ))
              : categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={`/shop?category=${cat.name}`}
                    className="group relative aspect-[3/4] sm:aspect-square overflow-hidden rounded-lg bg-muted flex-shrink-0 w-36 sm:w-auto block"
                  >
                    {cat.image && (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
                      <p className="text-white font-black text-xs sm:text-sm tracking-tight uppercase">{cat.name}</p>
                      <p className="text-white/60 text-[10px] sm:text-xs mt-0.5">{cat.count} items</p>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNERS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {PROMO_BANNERS.map((banner) => (
            <Link
              key={banner.subtitle}
              href={banner.href}
              className="group relative aspect-[4/3] sm:aspect-[3/4] overflow-hidden rounded-lg block"
            >
              <img
                src={banner.image}
                alt={banner.subtitle}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className={`absolute inset-0 ${banner.dark ? "bg-black/40" : "bg-white/20"}`} />
              <div className={`absolute inset-0 flex flex-col justify-end p-5 sm:p-8`}>
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${banner.dark ? "text-white/70" : "text-black/70"}`}>
                  {banner.title}
                </p>
                <h3 className={`text-2xl sm:text-3xl font-black tracking-tight mb-2 ${banner.dark ? "text-white" : "text-black"}`}>
                  {banner.subtitle}
                </h3>
                <p className={`text-sm mb-4 ${banner.dark ? "text-white/80" : "text-black/80"}`}>
                  {banner.desc}
                </p>
                <Button
                  size="sm"
                  className={`w-fit rounded-none text-xs font-bold px-5 ${banner.dark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"}`}
                >
                  {banner.cta} <ArrowRight className="h-3 w-3 ml-1.5" />
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase">New Arrivals</h2>
          <Link href="/shop" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors font-medium">
            View All <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Grid: 2 cols portrait mobile, 3 cols landscape/tablet, 4 cols desktop */}
        <div className="grid grid-cols-2 landscape:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-10">
          {productsLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-none" />
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

      {/* ── FULL-WIDTH BANNER ── */}
      <section className="relative overflow-hidden bg-black min-h-[300px] sm:min-h-[400px] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80"
          alt="Shop Collection"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          loading="lazy"
        />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60 mb-4">Quality Guaranteed</p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6 leading-none">
            Dress the part.<br />Live the part.
          </h2>
          <Button
            size="lg"
            onClick={() => setLocation("/shop")}
            className="rounded-none bg-white text-black hover:bg-white/90 px-8 sm:px-12 font-bold"
          >
            Shop Collection
          </Button>
        </div>
      </section>

      {/* ── FEATURE ICONS ── */}
      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { icon: "🚚", title: "Free Delivery", desc: "On orders over ₹999" },
              { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
              { icon: "🔒", title: "Secure Payment", desc: "100% safe checkout" },
              { icon: "⭐", title: "Quality Assured", desc: "Curated products only" },
            ].map((f) => (
              <div key={f.title} className="space-y-1.5">
                <div className="text-2xl sm:text-3xl">{f.icon}</div>
                <p className="text-xs sm:text-sm font-black uppercase tracking-tight">{f.title}</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
