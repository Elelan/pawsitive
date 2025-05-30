
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, Users, ListOrdered, BarChart3, ShieldCheck } from 'lucide-react';

// This is a placeholder Admin Dashboard page.
// We will build this out with actual functionality.

export default function AdminDashboardPage() {
  const { isAdmin, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/account'); // Or a specific "access denied" page
      }
    }
  }, [isAdmin, loading, isAuthenticated, router]);

  if (loading || !isAuthenticated || !isAdmin) {
    return <div className="container mx-auto py-12 text-center">Checking admin credentials...</div>;
  }

  // Admin is authenticated, show dashboard content
  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center">
          <ShieldCheck className="mr-3 h-10 w-10" /> Admin Dashboard
        </h1>
        <p className="text-muted-foreground">Manage your Pawsitive Cart store.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AdminFeatureCard
          title="Product Management"
          description="Add, edit, and remove products. Manage stock levels and categories."
          icon={<Package className="h-8 w-8 text-primary" />}
          linkHref="/admin/products"
          linkText="Manage Products"
        />
        <AdminFeatureCard
          title="Order Management"
          description="View and process customer orders. Update order statuses and track shipments."
          icon={<ListOrdered className="h-8 w-8 text-primary" />}
          linkHref="/admin/orders"
          linkText="Manage Orders"
        />
        <AdminFeatureCard
          title="Category Management"
          description="Create and organize product categories and pet types."
          icon={<BarChart3 className="h-8 w-8 text-primary" />}
          linkHref="/admin/categories"
          linkText="Manage Categories"
        />
         <AdminFeatureCard
          title="User Management"
          description="View customer accounts and manage user roles (future)."
          icon={<Users className="h-8 w-8 text-primary" />}
          linkHref="/admin/users"
          linkText="Manage Users (Soon)"
          disabled
        />
        {/* Add more cards for other admin features like analytics, settings, etc. */}
      </div>
    </div>
  );
}

interface AdminFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkHref: string;
  linkText: string;
  disabled?: boolean;
}

function AdminFeatureCard({ title, description, icon, linkHref, linkText, disabled }: AdminFeatureCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        {icon}
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      </CardContent>
      <CardContent className="pt-0">
         <Button asChild className="w-full" disabled={disabled}>
          <Link href={disabled ? "#" : linkHref}>{linkText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
