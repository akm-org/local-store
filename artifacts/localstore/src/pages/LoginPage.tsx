import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { setAuth } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useLogin({
    mutation: {
      onSuccess: (data) => {
        setAuth(data.user, data.token, data.isAdmin ?? false);
        toast({ title: `Welcome back, ${data.user.name}` });
        setLocation("/");
      },
      onError: () => {
        toast({ title: "Invalid email or password", variant: "destructive" });
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ data: { email, password } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-14">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight">Sign In</h1>
          <p className="text-muted-foreground mt-2 text-sm">Welcome back to LOCALSTORE</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-wider" htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 rounded-none"
              required
              data-testid="input-email"
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider" htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="mt-1 rounded-none"
              required
              data-testid="input-password"
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-none h-11 mt-2"
            disabled={login.isPending}
            data-testid="button-sign-in"
          >
            {login.isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          New to LOCALSTORE?{" "}
          <Link href="/signup" className="font-medium text-foreground hover:underline" data-testid="link-signup">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
