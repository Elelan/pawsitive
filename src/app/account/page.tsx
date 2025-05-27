import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit, ShoppingBag, MapPin } from "lucide-react";
import { mockOrders } from "@/lib/mock-data"; // Assuming mockOrders exist

export default function AccountDashboardPage() {
  const recentOrder = mockOrders.length > 0 ? mockOrders[0] : null;
  // Mock user data
  const user = {
    name: "Happy PetOwner",
    email: "petlover@example.com",
    memberSince: "January 15, 2023",
    defaultAddress: {
        street: "123 Cuddle Street",
        city: "Warmville",
        state: "PA",
        zipCode: "12345"
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back, {user.name}!</CardTitle>
          <CardDescription>Here's a quick overview of your account.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
            <div>
                <h3 className="font-semibold text-lg mb-1">Account Details</h3>
                <p className="text-sm text-muted-foreground">Email: {user.email}</p>
                <p className="text-sm text-muted-foreground">Member since: {user.memberSince}</p>
            </div>
            <div>
                <h3 className="font-semibold text-lg mb-1">Default Shipping Address</h3>
                {user.defaultAddress ? (
                    <>
                        <p className="text-sm text-muted-foreground">{user.defaultAddress.street}</p>
                        <p className="text-sm text-muted-foreground">{user.defaultAddress.city}, {user.defaultAddress.state} {user.defaultAddress.zipCode}</p>
                    </>
                ) : (
                    <p className="text-sm text-muted-foreground">No default address set.</p>
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
              <p className="text-sm"><strong>Order ID:</strong> {recentOrder.id}</p>
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
