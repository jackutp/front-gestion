"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User } from "@/src/types";
import { loginUser as loginApi, logoutUser as logoutApi } from "@/src/services/api";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (usuario: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (usuario: string, password: string) => {
    const result = await loginApi({ usuario, password });
    if (result.success && result.user) {
      setUser(result.user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    await logoutApi();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
