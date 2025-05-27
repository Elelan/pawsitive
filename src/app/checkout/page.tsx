"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { mockProducts } from '@/lib/mock-data'; // For mock cart items
import type { CartItem } from '@/lib/types';
import Image from 'next/image';
import { ArrowLeft, CreditCard, Truck } from 'lucide-react';

// Mock cart items for demonstration
const mockCartItems: CartItem[] = [
  { product: mockProducts[0], quantity: 1 },
  { product: mockProducts[1], quantity: 2 },
];

export default function CheckoutPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState('shipping'); // 'shipping', 'payment', 'review'
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    email: '',
    phoneNumber: '',
  });

  // Calculate totals (same as cart page, but could be passed from there)
  const subtotal = mockCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCost = 5.00; // Example shipping
  const taxes = subtotal * 0.08; // Example tax
  const total = subtotal + shippingCost + taxes;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = () => {
    // Validate form, process payment (mock), create order
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.email) {
        toast({ title: "Missing Information", description: "Please fill all required shipping fields.", variant: "destructive"});
        return;
    }
    toast({
      title: 'Order Placed!',
      description: 'Thank you for your purchase. Your order is being processed.',
    });
    // Redirect to an order confirmation page or account/orders
    // router.push('/account/orders/confirmation-id'); 
  };

  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Checkout</h1>
        <Button variant="outline" asChild>
            <Link href="/cart"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart</Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
        {/* Checkout Steps / Forms */}
        <div className="lg:col-span-2">
          <Accordion type="single" collapsible defaultValue="shipping" className="w-full">
            {/* Shipping Information */}
            <AccordionItem value="shipping">
              <AccordionTrigger className="text-xl font-semibold">
                <div className="flex items-center">
                    <Truck className="mr-3 h-6 w-6 text-primary"/> Shipping Information
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <form className="space-y-6 p-1 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" name="fullName" value={shippingInfo.fullName} onChange={handleInputChange} placeholder="John Doe" required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" value={shippingInfo.email} onChange={handleInputChange} placeholder="john.doe@example.com" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" name="address" value={shippingInfo.address} onChange={handleInputChange} placeholder="123 Pawsitive Lane" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" value={shippingInfo.city} onChange={handleInputChange} placeholder="Petville" required />
                    </div>
                    <div>
                      <Label htmlFor="state">State / Province</Label>
                      <Input id="state" name="state" value={shippingInfo.state} onChange={handleInputChange} placeholder="CA" required />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                      <Input id="zipCode" name="zipCode" value={shippingInfo.zipCode} onChange={handleInputChange} placeholder="90210" required />
                    </div>
                  </div>
                   <div>
                      <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                      <Input id="phoneNumber" name="phoneNumber" type="tel" value={shippingInfo.phoneNumber} onChange={handleInputChange} placeholder="(555) 123-4567" />
                    </div>
                  <Button onClick={() => setCurrentStep('payment')} className="w-full md:w-auto">Continue to Payment</Button>
                </form>
              </AccordionContent>
            </AccordionItem>

            {/* Payment Information (Mock) */}
            <AccordionItem value="payment">
              <AccordionTrigger className="text-xl font-semibold">
                <div className="flex items-center">
                     <CreditCard className="mr-3 h-6 w-6 text-primary"/> Payment Details
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-1 pt-4 space-y-4">
                  <p className="text-muted-foreground">This is a mock payment section. In a real application, integrate a payment gateway like Stripe or PayPal.</p>
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="•••• •••• •••• ••••" disabled />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input id="expiryDate" placeholder="MM/YY" disabled />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="•••" disabled />
                    </div>
                  </div>
                  <Button onClick={() => setCurrentStep('review')} className="w-full md:w-auto">Review Order</Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg rounded-lg sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockCartItems.map(item => (
                <div key={item.product.id} className="flex items-center justify-between gap-3">
                  <div className="relative w-16 h-16 aspect-square rounded-md overflow-hidden shrink-0">
                      <Image src={item.product.imageUrl} alt={item.product.name} fill sizes="64px" className="object-cover" data-ai-hint={item.product.dataAiHint || "checkout item"} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-primary">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                size="lg"
                className="w-full"
                onClick={handlePlaceOrder}
                disabled={currentStep !== 'review' && currentStep !== 'payment'} // Enable when ready
              >
                Place Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
