
"use client";

import React, { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_STORAGE_KEY = 'pawsitiveCartUser';

interface AuthUser {
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  currentUser: AuthUser | null;
  login: (role: 'user' | 'admin', email?: string) => void;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error reading user from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((role: 'user' | 'admin', email?: string) => {
    const userToLogin: AuthUser = {
      email: email || (role === 'admin' ? 'admin@pawsitive.com' : 'user@pawsitive.com'),
      role,
    };
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userToLogin));
    } catch (error) {
        console.error("Error saving user to localStorage", error);
    }
    setCurrentUser(userToLogin);
    if (role === 'admin') {
      router.push('/admin'); 
    } else {
      router.push('/account');
    }
  }, [router]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
        console.error("Error removing user from localStorage", error);
    }
    setCurrentUser(null);
    router.push('/');
  }, [router]);

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
