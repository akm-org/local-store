import { Link } from "wouter";
import { Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <p className="font-black text-lg tracking-tight mb-3">LOCALSTORE</p>
            <p className="text-sm text-muted-foreground">Quality products at honest prices. Local trust, delivered to your door.</p>
            <div className="flex gap-3 mt-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="h-8 w-8 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Dress", "Lifestyle", "Essentials", "Electronics", "Accessories"].map((c) => (
                <li key={c}>
                  <Link href={`/shop?category=${c}`} className="hover:text-foreground transition-colors">{c}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Help</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/orders" className="hover:text-foreground transition-colors">Track Order</Link></li>
              <li><Link href="/cart" className="hover:text-foreground transition-colors">Your Cart</Link></li>
              <li><Link href="/wishlist" className="hover:text-foreground transition-colors">Wishlist</Link></li>
              <li><Link href="/signup" className="hover:text-foreground transition-colors">Create Account</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Admin</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/admin/login" className="hover:text-foreground transition-colors">Admin Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">© 2026 LOCALSTORE. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Secure QR Payments</p>
        </div>
      </div>
    </footer>
  );
}
