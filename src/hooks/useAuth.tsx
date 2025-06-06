
"use client";

import React, { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthUser } from '@/lib/types'; // Using the updated AuthUser from types.ts
import { Role as PrismaRole } from '@prisma/client';

interface AuthContextType {
  currentUser: AuthUser | null;
  login: (credentials: { email: string; password: string }) => Promise<AuthUser | null>;
  signup: (details: { name: string; email: string; password: string }) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  loading: boolean; // For initial session check
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true); // True initially while checking session
  const router = useRouter();

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user as AuthUser | null); // user can be null if no session
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
    // setLoading(true); // Removed: Page component will handle its own submission loading state
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
        console.error("Login failed:", errorData.message);
        setCurrentUser(null); 
        return null;
      }
    } catch (error) {
      console.error("Login request error:", error);
      setCurrentUser(null);
      return null;
    } finally {
      // setLoading(false); // Removed
    }
  };

  const signup = async (details: { name: string; email: string; password: string }): Promise<AuthUser | null> => {
    // setLoading(true); // Removed: Page component will handle its own submission loading state
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      if (response.ok) {
        // const user = await response.json(); // User data from signup response
        // After successful signup, proceed to login to establish session via cookie
        const loginResponse = await login({email: details.email, password: details.password});
        return loginResponse; 
      } else {
        const errorData = await response.json();
        console.error("Signup failed:", errorData.message || errorData.errors);
        return null;
      }
    } catch (error) {
      console.error("Signup request error:", error);
      return null;
    } finally {
      // setLoading(false); // Removed
    }
  };

  const logout = async () => {
    // setLoading(true); // No need to set loading for logout in the same way
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error("Logout request error:", error);
    } finally {
      setCurrentUser(null);
      // setLoading(false);
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
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
