
// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, LogOut, ShieldCheck, UserCircle } from 'lucide-react';
import Logo from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { initialCartItems } from '@/lib/mock-data'; // For initial count
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const navItems = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
];

const CART_COUNT_STORAGE_KEY = 'pawsitiveCartCount';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const { currentUser, logout, isAdmin, isAuthenticated } = useAuth();

  const updateCartCount = () => {
    try {
      const countStr = localStorage.getItem(CART_COUNT_STORAGE_KEY);
      if (countStr !== null) {
        setCartCount(parseInt(countStr, 10));
      } else {
        setCartCount(initialCartItems.reduce((sum, item) => sum + item.quantity, 0));
      }
    } catch (error) {
        console.warn("Could not read cart count from localStorage", error);
        setCartCount(initialCartItems.reduce((sum, item) => sum + item.quantity, 0));
    }
  };

  useEffect(() => {
    updateCartCount(); 

    window.addEventListener('storage', updateCartCount);
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === CART_COUNT_STORAGE_KEY) {
            updateCartCount();
        }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-foreground/70"
                )}
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname.startsWith('/admin') ? "text-primary" : "text-foreground/70"
                )}
              >
                Admin Panel
              </Link>
            )}
          </nav>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-background rounded-md border border-input px-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="h-9 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              />
            </div>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart" aria-label="Shopping Cart">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 px-2 py-0.5 text-xs rounded-full">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>
            
            {isAuthenticated ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="My Account Menu">
                            {isAdmin ? <ShieldCheck className="h-6 w-6 text-primary" /> : <UserCircle className="h-6 w-6" />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account {isAdmin && "(Admin)"}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/account"><User className="mr-2 h-4 w-4" /> Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/account/orders"><ShoppingCart className="mr-2 h-4 w-4" /> Orders</Link>
                        </DropdownMenuItem>
                        {isAdmin && (
                            <DropdownMenuItem asChild>
                               <Link href="/admin"><ShieldCheck className="mr-2 h-4 w-4" /> Admin Dashboard</Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                 <Button variant="ghost" size="icon" asChild>
                    <Link href="/login" aria-label="Login">
                        <User className="h-6 w-6" />
                    </Link>
                </Button>
            )}

            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] bg-card">
                  <div className="p-6">
                    <Logo />
                    <div className="mt-8 flex items-center space-x-2 bg-background rounded-md border border-input px-2">
                       <Search className="h-5 w-5 text-muted-foreground" />
                       <Input
                         type="search"
                         placeholder="Search products..."
                         className="h-9 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                       />
                    </div>
                    <nav className="mt-8 flex flex-col space-y-4">
                      {navItems.map((item) => (
                        <SheetClose asChild key={item.label}>
                          <Link
                            href={item.href}
                            className={cn(
                              "text-lg font-medium transition-colors hover:text-primary",
                              pathname === item.href ? "text-primary" : "text-foreground/70"
                            )}
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      ))}
                      {isAdmin && (
                         <SheetClose asChild>
                            <Link
                                href="/admin"
                                className={cn(
                                "text-lg font-medium transition-colors hover:text-primary",
                                pathname.startsWith('/admin') ? "text-primary" : "text-foreground/70"
                                )}
                            >
                                Admin Panel
                            </Link>
                        </SheetClose>
                      )}
                      {isAuthenticated && (
                        <SheetClose asChild>
                           <Button variant="outline" onClick={logout} className="w-full mt-4">
                             <LogOut className="mr-2 h-5 w-5" /> Logout
                           </Button>
                        </SheetClose>
                      )}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
