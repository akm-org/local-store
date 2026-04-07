import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useSignup } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const { setAuth } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "", phone: "" });

  const signup = useSignup({
    mutation: {
      onSuccess: (data) => {
        setAuth(data.user, data.token, false);
        toast({ title: `Welcome, ${data.user.name}!` });
        setLocation("/");
      },
      onError: (err: any) => {
        toast({ title: err?.response?.data?.error ?? "Signup failed", variant: "destructive" });
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup.mutate({ data: form });
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-14 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight">Create Account</h1>
          <p className="text-muted-foreground mt-2 text-sm">Join LOCALSTORE</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { field: "name", label: "Full Name", type: "text", placeholder: "Your name" },
            { field: "email", label: "Email", type: "email", placeholder: "you@example.com" },
            { field: "password", label: "Password", type: "password", placeholder: "Choose a password" },
            { field: "address", label: "Address", type: "text", placeholder: "Delivery address" },
            { field: "phone", label: "Phone", type: "tel", placeholder: "Contact number" },
          ].map(({ field, label, type, placeholder }) => (
            <div key={field}>
              <Label className="text-xs uppercase tracking-wider" htmlFor={field}>{label}</Label>
              <Input
                id={field}
                type={type}
                value={form[field as keyof typeof form]}
                onChange={handleChange(field)}
                placeholder={placeholder}
                className="mt-1 rounded-none"
                required
                data-testid={`input-${field}`}
              />
            </div>
          ))}

          <Button
            type="submit"
            className="w-full rounded-none h-11 mt-2"
            disabled={signup.isPending}
            data-testid="button-create-account"
          >
            {signup.isPending ? "Creating..." : "Create Account"}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground hover:underline" data-testid="link-login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
