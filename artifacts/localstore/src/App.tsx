import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrdersPage from "@/pages/OrdersPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import WishlistPage from "@/pages/WishlistPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminProductsPage from "@/pages/AdminProductsPage";
import AdminOrdersPage from "@/pages/AdminOrdersPage";
import AdminPaymentPage from "@/pages/AdminPaymentPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const ADMIN_ROUTES = ["/admin", "/admin/products", "/admin/orders", "/admin/payment", "/admin/login"];

function AppShell() {
  return (
    <>
      <Navbar />
      <main>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/product/:id" component={ProductPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/orders" component={OrdersPage} />
          <Route path="/wishlist" component={WishlistPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/admin/login" component={AdminLoginPage} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/products" component={AdminProductsPage} />
          <Route path="/admin/orders" component={AdminOrdersPage} />
          <Route path="/admin/payment" component={AdminPaymentPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppShell />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
