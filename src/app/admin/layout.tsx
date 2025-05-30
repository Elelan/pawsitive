
"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import Logo from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package, ListOrdered, BarChart3, Users, Settings, ShieldCheck, LogOut, LayoutDashboard, Home } from 'lucide-react';

// Placeholder Admin Layout. We will refine this.

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: BarChart3 },
  { href: '/admin/orders', label: 'Orders', icon: ListOrdered },
  { href: '/admin/users', label: 'Users', icon: Users, disabled: true }, // Example for future
  { href: '/admin/settings', label: 'Settings', icon: Settings, disabled: true }, // Example for future
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, loading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (isClient && !loading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/admin');
      } else if (!isAdmin) {
        // If logged in but not admin, redirect to user account or homepage
        router.push('/account?error=unauthorized');
      }
    }
  }, [isAdmin, loading, isAuthenticated, router, isClient]);

  if (!isClient || loading || !isAuthenticated || !isAdmin) {
    // Optional: show a more specific loading/auth checking screen
    return <div className="flex h-screen items-center justify-center bg-background text-foreground">Authenticating Admin Access...</div>;
  }

  // Admin is authenticated, show layout and children
  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden md:flex flex-col w-64 border-r bg-background fixed h-full">
        <div className="flex h-20 items-center px-6 border-b">
          <Logo />
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="grid items-start px-4 text-sm font-medium">
            {adminNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.disabled ? "#" : item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary',
                  (item.exact ? pathname === item.href : pathname.startsWith(item.href)) && !item.disabled
                    ? 'bg-primary/10 text-primary font-semibold'
                    : '',
                  item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                )}
                aria-disabled={item.disabled}
                onClick={(e) => item.disabled && e.preventDefault()}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="mt-auto p-4 border-t">
            <Button variant="outline" className="w-full justify-start mb-2" asChild>
                 <Link href="/"><Home className="mr-2 h-4 w-4" /> Back to Site</Link>
            </Button>
           <Button variant="destructive" className="w-full justify-start" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
        </div>
      </aside>
      <div className="flex flex-col flex-1 md:ml-64">
        {/* Mobile Header can be added here if needed */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 md:hidden">
            <Logo />
            {/* Mobile nav trigger can go here */}
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
