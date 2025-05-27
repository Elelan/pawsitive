"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, ShoppingBag, MapPin, CreditCard, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/account', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/account/profile', label: 'Profile', icon: User },
  { href: '/account/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/payment-methods', label: 'Payment Methods', icon: CreditCard },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 lg:w-72 space-y-6">
      <nav className="flex flex-col space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors',
              pathname === item.href
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'text-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon className={cn(
              'mr-3 h-5 w-5',
              pathname === item.href ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
            )} />
            {item.label}
          </Link>
        ))}
      </nav>
      <Button variant="outline" className="w-full justify-start">
          <LogOut className="mr-3 h-5 w-5 text-muted-foreground" />
          Logout
      </Button>
    </aside>
  );
}
