import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const { setAuth } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const adminLogin = useAdminLogin({
    mutation: {
      onSuccess: (data) => {
        setAuth(data.user, data.token, true);
        toast({ title: "Admin access granted" });
        setLocation("/admin");
      },
      onError: () => {
        toast({ title: "Invalid admin credentials", variant: "destructive" });
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adminLogin.mutate({ data: { username, password } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-14">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">LOCALSTORE</p>
          <h1 className="text-3xl font-black tracking-tight">Admin</h1>
          <p className="text-muted-foreground mt-2 text-sm">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-wider" htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin username"
              className="mt-1 rounded-none"
              required
              data-testid="input-username"
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider" htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="mt-1 rounded-none"
              required
              data-testid="input-admin-password"
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-none h-11 mt-2"
            disabled={adminLogin.isPending}
            data-testid="button-admin-sign-in"
          >
            {adminLogin.isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
