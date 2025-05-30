
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, ShoppingBag, MapPin, CreditCard, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth.tsx';

const baseNavItems = [
  { href: '/account', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/account/profile', label: 'Profile', icon: User },
  { href: '/account/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/payment-methods', label: 'Payment Methods', icon: CreditCard },
];

const adminNavItems = [
    { href: '/admin', label: 'Admin Dashboard', icon: ShieldCheck },
    // We will add more admin links here like /admin/products, /admin/orders etc.
];


export default function AccountSidebar() {
  const pathname = usePathname();
  const { logout, isAdmin, isAuthenticated } = useAuth();

  const navItems = isAdmin ? [...baseNavItems, ...adminNavItems.filter(item => item.href !== '/admin' || pathname.startsWith('/account'))] : baseNavItems;
  // If admin is viewing /account section, still show base items. 
  // If admin is on /admin section, they'll have a different sidebar (created later).

  if (!isAuthenticated) {
      return null; // Or a loading state/message
  }

  return (
    <aside className="w-full md:w-64 lg:w-72 space-y-6">
      <nav className="flex flex-col space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors',
              // Exact match for parent /account, partial for children
              (pathname === item.href || (item.href !== '/account' && pathname.startsWith(item.href)))
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'text-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon className={cn(
              'mr-3 h-5 w-5',
              (pathname === item.href || (item.href !== '/account' && pathname.startsWith(item.href))) ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
            )} />
            {item.label}
          </Link>
        ))}
      </nav>
      <Button variant="outline" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-3 h-5 w-5 text-muted-foreground" />
          Logout
      </Button>
    </aside>
  );
}
