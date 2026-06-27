// src/context/AuthContext.tsx

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, UserResponse, LoginRequest, RegistroRequest } from '@/services/authService';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<boolean>;
  registro: (data: RegistroRequest) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Funciones para manejar cookies
const setCookie = (name: string, value: string, hours: number) => {
  const date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; path=/; expires=${date.toUTCString()}; SameSite=Lax`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Cargar usuario desde localStorage al iniciar
    const token = authService.getToken();
    const savedUser = authService.getUser();
    if (token && savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      setUser(response);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));

      // ✅ Guardar token en cookie para el middleware (8 horas)
      setCookie('token', response.token, 8);

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const registro = async (data: RegistroRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.registro(data);
      setUser(response);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));

      // ✅ Guardar token en cookie para el middleware (8 horas)
      setCookie('token', response.token, 8);

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    deleteCookie('token'); // ✅ Eliminar cookie
    router.push('/login');
  };

  const isAuthenticated = !!user;
  const hasRole = (role: string) => user?.tipo === role;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        registro,
        logout,
        isAuthenticated,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}