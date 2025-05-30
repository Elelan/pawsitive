
"use client";

import AccountSidebar from '@/components/layout/AccountSidebar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth.tsx';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    // You can show a loading spinner here
    return <div className="container mx-auto py-8 md:py-12 text-center">Loading account...</div>;
  }

  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">My Account {currentUser?.role === 'admin' && (<span className="text-sm text-accent">(Admin View)</span>)}</h1>
        <p className="text-muted-foreground">Manage your profile, orders, and preferences.</p>
      </div>
      <Separator className="mb-8"/>
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        <AccountSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
