// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "../lib/auth";
import { loginApi, logoutApi, profileApi } from "../lib/auth";

type AuthState = {
  user: User | null;
  token: string;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  });

  const [token, setToken] = useState<string>(() => localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // ✅ đặt ở đây mới đúng
      const hasToken = !!localStorage.getItem("token");
      if (!hasToken) {
        setLoading(false);
        return;
      }

      try {
        const u = await profileApi();
        setUser(u);
      } catch {
        setUser(null);
      } finally {
        setToken(localStorage.getItem("token") || "");
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const { token: tk, user: u } = await loginApi(email, password);
    setToken(tk || "");
    setUser(u);

    // nếu login không trả user -> gọi profile lấy user
    if (!u) {
      try {
        const prof = await profileApi();
        setUser(prof);
      } catch {
        // ignore
      }
    }
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
    setToken("");
  };

  const value = useMemo(
    () => ({ user, token, loading, login, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getRoleNames(user: User | null) {
  if (!user) return [];
  if (Array.isArray(user.roles)) return user.roles;
  if (Array.isArray(user.user_roles)) {
    return user.user_roles.map((ur) => ur?.role?.role_name).filter(Boolean) as string[];
  }
  return [];
}
