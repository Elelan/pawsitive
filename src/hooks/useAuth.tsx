
"use client";

import React, { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthUser } from '@/lib/types'; 
import { Role as PrismaRole } from '@prisma/client';

interface AuthContextType {
  currentUser: AuthUser | null;
  login: (credentials: { email: string; password: string }) => Promise<AuthUser | null>;
  signup: (details: { name: string; email: string; password: string }) => Promise<{ user: AuthUser | null; error?: string | { [key: string]: string[] } }>;
  logout: () => Promise<void>;
  loading: boolean; 
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user as AuthUser | null); 
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (credentials: { email: string; password: string }): Promise<AuthUser | null> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user as AuthUser);
        router.push(user.role === PrismaRole.ADMIN ? '/admin' : '/account');
        return user as AuthUser;
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData.message || errorData);
        setCurrentUser(null); 
        return null;
      }
    } catch (error) {
      console.error("Login request error:", error);
      setCurrentUser(null);
      return null;
    }
  };

  const signup = async (details: { name: string; email: string; password: string }): Promise<{ user: AuthUser | null; error?: string | { [key:string]: string[]} }> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      
      const responseBody = await response.json();

      if (response.ok) {
        // After successful signup, proceed to login to establish session via cookie
        const loginResult = await login({email: details.email, password: details.password});
        return { user: loginResult };
      } else {
        // Handle specific error messages from API
        console.error("Signup API failed with status:", response.status, "Body:", responseBody);
        const errorMessage = responseBody.message || 'Signup failed. Please try again.';
        const errorDetails = responseBody.errors || (responseBody.field ? { [responseBody.field] : [errorMessage] } : undefined);
        return { user: null, error: errorDetails || errorMessage };
      }
    } catch (error) {
      console.error("Signup request error (network or fetch issue):", error);
      return { user: null, error: 'A network error occurred. Please check your connection.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error("Logout request error:", error);
    } finally {
      setCurrentUser(null);
      router.push('/');
    }
  };

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === PrismaRole.ADMIN;

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, loading, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider. Make sure AuthProvider is an ancestor of the component using useAuth.');
  }
  return context;
}
