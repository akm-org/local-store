import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Heart, Search, Menu, X, User, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGetCart } from "@workspace/api-client-react";
import { useGetWishlist } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CATEGORIES = ["Dress", "Lifestyle", "Essentials", "Electronics", "Accessories"];

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const { user, isAdmin, isLoggedIn, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: cart } = useGetCart(
    { userId: user?.id ?? "" },
    { query: { enabled: !!user?.id } }
  );
  const { data: wishlist } = useGetWishlist(
    { userId: user?.id ?? "" },
    { query: { enabled: !!user?.id } }
  );

  const cartCount = cart?.itemCount ?? 0;
  const wishlistCount = wishlist?.productIds?.length ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="font-black text-xl tracking-tight" data-testid="link-logo">
            LOCALSTORE
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/shop?category=${cat}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid={`link-category-${cat.toLowerCase()}`}
              >
                {cat}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              data-testid="button-search"
              className="hidden sm:flex"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => isLoggedIn ? setLocation("/wishlist") : setLocation("/login")}
              className="relative"
              data-testid="button-wishlist"
            >
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-foreground text-background text-[10px] font-bold rounded-full flex items-center justify-center" data-testid="text-wishlist-count">
                  {wishlistCount}
                </span>
              )}
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/cart")}
              className="relative"
              data-testid="button-cart"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-foreground text-background text-[10px] font-bold rounded-full flex items-center justify-center" data-testid="text-cart-count">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* User menu */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="button-user-menu">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation("/orders")} data-testid="menu-orders">
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/wishlist")} data-testid="menu-wishlist">
                    Wishlist
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setLocation("/admin")} data-testid="menu-admin">
                        <Shield className="h-3 w-3 mr-2" />
                        Admin Panel
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => { logout(); setLocation("/"); }}
                    className="text-destructive"
                    data-testid="button-logout"
                  >
                    <LogOut className="h-3 w-3 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/login")}
                className="text-sm"
                data-testid="button-login"
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="py-3 border-t border-border">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                autoFocus
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                data-testid="input-search"
              />
              <Button type="submit" size="sm" data-testid="button-search-submit">Search</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setSearchOpen(false)}>Cancel</Button>
            </form>
          </div>
        )}

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/shop?category=${cat}`}
                  className="text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat}
                </Link>
              ))}
              <div className="pt-2 border-t border-border">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="sm">Search</Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
