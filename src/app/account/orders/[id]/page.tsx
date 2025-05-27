import { mockOrders, mockProducts } from '@/lib/mock-data';
import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, MapPin, CreditCardIcon } from 'lucide-react';

async function getOrderById(id: string): Promise<Order | undefined> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockOrders.find(order => order.id === id);
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold">Order Not Found</h2>
        <p className="text-muted-foreground">The order you are looking for does not exist.</p>
         <Button variant="link" asChild className="mt-4">
            <Link href="/account/orders"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Order Details</h1>
            <Button variant="outline" asChild>
                <Link href="/account/orders"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders</Link>
            </Button>
        </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
            <div>
                <CardTitle className="text-xl">Order #{order.id.slice(-6).toUpperCase()}</CardTitle>
                <CardDescription>Placed on {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
            </div>
            <Badge variant={order.status === 'delivered' ? 'default' : order.status === 'cancelled' ? 'destructive' : 'secondary'} className="capitalize text-sm px-3 py-1 self-start md:self-center">
              {order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Order Items */}
          <h3 className="text-lg font-semibold mb-4 flex items-center"><Package className="mr-2 h-5 w-5 text-primary"/> Items in this order</h3>
          <div className="space-y-4 mb-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-3 border rounded-md bg-muted/20">
                <div className="relative w-20 h-20 aspect-square rounded-md overflow-hidden shrink-0">
                    <Image src={item.product.imageUrl} alt={item.product.name} fill sizes="80px" className="object-cover" data-ai-hint={item.product.dataAiHint || "order item"} />
                </div>
                <div className="flex-grow">
                  <Link href={`/products/${item.product.id}`} className="font-medium hover:text-primary hover:underline">{item.product.name}</Link>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  <p className="text-sm text-muted-foreground">Price: ${item.product.price.toFixed(2)}</p>
                </div>
                <p className="text-md font-semibold text-right">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <Separator className="my-6"/>

          {/* Order Summary Totals */}
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
            <div>
                <h4 className="font-semibold mb-1">Subtotal:</h4>
                <p>${(order.totalAmount - 5 - (order.totalAmount * 0.08 / 1.08)).toFixed(2)}</p> {/* Approximating subtotal */}
            </div>
            <div>
                <h4 className="font-semibold mb-1">Shipping:</h4>
                <p>$5.00</p> {/* Example */}
            </div>
             <div>
                <h4 className="font-semibold mb-1">Taxes:</h4>
                <p>${(order.totalAmount * 0.08 / 1.08).toFixed(2)}</p> {/* Approximating tax */}
            </div>
            <div>
                <h4 className="font-semibold mb-1 text-primary">Order Total:</h4>
                <p className="font-bold text-lg text-primary">${order.totalAmount.toFixed(2)}</p>
            </div>
          </div>
          <Separator className="my-6"/>

          {/* Shipping and Payment Details */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary"/> Shipping Address</h3>
              <address className="not-italic text-sm text-muted-foreground space-y-0.5">
                <p>{order.shippingAddress.fullName || 'N/A'}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </address>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center"><CreditCardIcon className="mr-2 h-5 w-5 text-primary"/> Payment Method</h3>
              <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
              {/* Typically show last 4 digits of card, etc. */}
            </div>
          </div>
          
          {order.trackingNumber && (
            <>
                <Separator className="my-6"/>
                <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center"><Truck className="mr-2 h-5 w-5 text-primary"/> Tracking Information</h3>
                    <p className="text-sm text-muted-foreground">Tracking Number: <span className="font-medium text-foreground">{order.trackingNumber}</span></p>
                    <Button variant="link" className="p-0 h-auto text-sm mt-1" asChild>
                        <Link href={`https://www.example.com/track?id=${order.trackingNumber}`} target="_blank" rel="noopener noreferrer">
                            Track Package
                        </Link>
                    </Button>
                </div>
            </>
          )}

        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Print Invoice</Button>
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <Button variant="destructive">Cancel Order</Button>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}
