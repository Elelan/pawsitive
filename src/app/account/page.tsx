
"use client"; // Make this a client component to use hooks

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit, ShoppingBag, MapPin, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth.tsx";
import type { Order, Address } from "@/lib/types"; 
// For now, we will keep fetching mockOrders for recent order display
// A full order fetching mechanism would be more complex.
import { mockOrders } from "@/lib/mock-data";
import { getUserAddresses } from "@/lib/data-service"; // For default address

export default function AccountDashboardPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    // Simulate fetching recent order (using mock for now)
    // In a real app, fetch user's actual recent order
    if (mockOrders.length > 0) {
      setRecentOrder(mockOrders[0]);
    }

    const fetchDashboardData = async () => {
      if (currentUser?.id) {
        setIsLoadingData(true);
        try {
          const addresses = await getUserAddresses(currentUser.id);
          const userDefaultAddress = addresses.find(addr => addr.isDefault) || (addresses.length > 0 ? addresses[0] : null);
          setDefaultAddress(userDefaultAddress);
        } catch (error) {
          console.error("Failed to fetch dashboard data", error);
          // Handle error (e.g., show toast)
        } finally {
          setIsLoadingData(false);
        }
      } else {
        setIsLoadingData(false);
      }
    };

    if (!authLoading) {
        fetchDashboardData();
    }
  }, [currentUser, authLoading]);

  if (authLoading || isLoadingData) {
    return <div className="container mx-auto py-12 text-center"><Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" /> Loading dashboard...</div>;
  }

  if (!currentUser) {
    // This case should ideally be handled by the AccountLayout redirecting to login
    return <div className="container mx-auto py-12 text-center">Please log in to view your account.</div>;
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back, {currentUser.name || 'Valued Customer'}!</CardTitle>
          <CardDescription>Here's a quick overview of your account.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
            <div>
                <h3 className="font-semibold text-lg mb-1">Account Details</h3>
                <p className="text-sm text-muted-foreground">Email: {currentUser.email}</p>
                {/* Member since could be added if stored on user model and fetched */}
                {/* <p className="text-sm text-muted-foreground">Member since: {new Date(currentUser.createdAt).toLocaleDateString()}</p> */}
            </div>
            <div>
                <h3 className="font-semibold text-lg mb-1">Default Shipping Address</h3>
                {defaultAddress ? (
                    <>
                        <p className="text-sm text-muted-foreground">{defaultAddress.street}</p>
                        <p className="text-sm text-muted-foreground">{defaultAddress.city}, {defaultAddress.state} {defaultAddress.zipCode}</p>
                    </>
                ) : (
                    <p className="text-sm text-muted-foreground">No default address set. <Link href="/account/addresses" className="text-primary hover:underline">Add one now</Link>.</p>
                )}
            </div>
            <div className="md:col-span-2">
                 <Button variant="outline" asChild>
                    <Link href="/account/profile"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Link>
                </Button>
            </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Recent Order</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/account/orders"><ShoppingBag className="mr-2 h-4 w-4" /> View All Orders</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentOrder ? (
            <div>
              <p className="text-sm"><strong>Order ID:</strong> #{recentOrder.id.slice(-6).toUpperCase()}</p>
              <p className="text-sm"><strong>Date:</strong> {new Date(recentOrder.createdAt).toLocaleDateString()}</p>
              <p className="text-sm"><strong>Total:</strong> ${recentOrder.totalAmount.toFixed(2)}</p>
              <p className="text-sm"><strong>Status:</strong> <span className="capitalize font-medium text-primary">{recentOrder.status}</span></p>
              <Button variant="secondary" size="sm" className="mt-4" asChild>
                 <Link href={`/account/orders/${recentOrder.id}`}>View Details</Link>
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">You have no recent orders.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl flex items-center"><ShoppingBag className="mr-2 h-5 w-5 text-primary"/> Your Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">View your order history, track shipments, and manage returns.</p>
                <Button asChild>
                    <Link href="/account/orders">Go to Orders</Link>
                </Button>
            </CardContent>
        </Card>
         <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary"/> Your Addresses</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Manage your shipping and billing addresses for faster checkout.</p>
                <Button asChild>
                    <Link href="/account/addresses">Manage Addresses</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
