import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAdmin: boolean;
  isLoggedIn: boolean;
  setAuth: (user: UserProfile, token: string, isAdmin?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try { return JSON.parse(localStorage.getItem("ls_user") || "null"); } catch { return null; }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("ls_token"));
  const [isAdmin, setIsAdmin] = useState<boolean>(() => localStorage.getItem("ls_admin") === "true");

  const setAuth = (u: UserProfile, tok: string, admin = false) => {
    setUser(u);
    setToken(tok);
    setIsAdmin(admin);
    localStorage.setItem("ls_user", JSON.stringify(u));
    localStorage.setItem("ls_token", tok);
    localStorage.setItem("ls_admin", String(admin));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem("ls_user");
    localStorage.removeItem("ls_token");
    localStorage.removeItem("ls_admin");
  };

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, isLoggedIn: !!user, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
