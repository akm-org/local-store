import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { SlidersHorizontal, X } from "lucide-react";
import { useListProducts } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = ["Dress", "Lifestyle", "Essentials", "Electronics", "Accessories"];

export default function ShopPage() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const initCategory = params.get("category") ?? "";
  const initSearch = params.get("search") ?? "";

  const [category, setCategory] = useState(initCategory);
  const [search, setSearch] = useState(initSearch);
  const [sort, setSort] = useState("newest");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setCategory(initCategory);
    setSearch(initSearch);
  }, [initCategory, initSearch]);

  const { data: products, isLoading } = useListProducts({ category: category || undefined, search: search || undefined, sort: sort as "newest" | "price_asc" | "price_desc" | "popular" });

  const clearFilter = (type: "category" | "search") => {
    if (type === "category") setCategory("");
    if (type === "search") setSearch("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between py-8 border-b border-border">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            {category ? category : search ? `"${search}"` : "All Products"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{products?.length ?? 0} items</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-36 h-9 text-sm rounded-none" data-testid="select-sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="rounded-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            data-testid="button-filter"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      <div className="flex gap-2 py-3 flex-wrap">
        {category && (
          <Badge variant="secondary" className="gap-1 rounded-full cursor-pointer" onClick={() => clearFilter("category")}>
            {category} <X className="h-3 w-3" />
          </Badge>
        )}
        {search && (
          <Badge variant="secondary" className="gap-1 rounded-full cursor-pointer" onClick={() => clearFilter("search")}>
            "{search}" <X className="h-3 w-3" />
          </Badge>
        )}
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        {(sidebarOpen) && (
          <aside className="w-56 flex-shrink-0">
            <div className="sticky top-20">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Categories</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setCategory("")}
                    className={`text-sm w-full text-left py-1.5 hover:text-foreground transition-colors ${!category ? "font-bold text-foreground" : "text-muted-foreground"}`}
                    data-testid="filter-category-all"
                  >
                    All
                  </button>
                </li>
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setCategory(cat)}
                      className={`text-sm w-full text-left py-1.5 hover:text-foreground transition-colors ${category === cat ? "font-bold text-foreground" : "text-muted-foreground"}`}
                      data-testid={`filter-category-${cat.toLowerCase()}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Search</h3>
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-none"
                  data-testid="input-shop-search"
                />
              </div>
            </div>
          </aside>
        )}

        {/* Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-lg" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : products?.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">No products found</p>
              <Button variant="outline" className="mt-4 rounded-none" onClick={() => { setCategory(""); setSearch(""); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
