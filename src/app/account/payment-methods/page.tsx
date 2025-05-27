"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit3, Trash2, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentMethod {
  id: string;
  type: 'Visa' | 'Mastercard' | 'Amex' | 'PayPal';
  last4: string;
  expiry: string;
  isDefault?: boolean;
}

const initialPaymentMethods: PaymentMethod[] = [
  { id: 'pm1', type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
  { id: 'pm2', type: 'PayPal', last4: 'user@example.com', expiry: 'N/A', isDefault: false },
];

export default function PaymentMethodsPage() {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddPaymentMethod = () => {
    // This is a mock. In a real app, you'd use a payment gateway's SDK (e.g., Stripe Elements).
    toast({
      title: "Add Payment Method",
      description: "This functionality would integrate with a payment provider.",
    });
    setIsModalOpen(false);
  };
  
  const handleDelete = (id: string) => {
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
      toast({ title: "Payment Method Removed", description: "The selected payment method has been removed." });
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(pm => ({ ...pm, isDefault: pm.id === id })));
    toast({ title: "Default Payment Set", description: "This payment method is now your default." });
  };


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-semibold">Payment Methods</h2>
            <p className="text-muted-foreground">Manage your saved payment options.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-5 w-5" /> Add Payment Method</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Payment Method</DialogTitle>
              <DialogDescription>
                Securely add a new card or link your PayPal. (This is a demo UI)
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Mock form fields. Real implementation would use Stripe Elements or similar. */}
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="•••• •••• •••• ••••" disabled />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="expiryDateModal">Expiry Date</Label>
                    <Input id="expiryDateModal" placeholder="MM/YY" disabled />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="cvcModal">CVC</Label>
                    <Input id="cvcModal" placeholder="•••" disabled />
                 </div>
              </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddPaymentMethod}>Save Payment Method</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {paymentMethods.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {paymentMethods.map((pm) => (
            <Card key={pm.id} className={`shadow-md relative ${pm.isDefault ? 'border-2 border-primary' : ''}`}>
                {pm.isDefault && <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">Default</div>}
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-primary" /> {pm.type}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {pm.type !== 'PayPal' ? (
                  <>
                    <p>Ending in: •••• {pm.last4}</p>
                    <p>Expires: {pm.expiry}</p>
                  </>
                ) : (
                  <p>Account: {pm.last4}</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                 {!pm.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => handleSetDefault(pm.id)}>Set as Default</Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => toast({title: "Edit Mocked", description: "Editing is not implemented for this demo."})} aria-label="Edit Payment Method">
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(pm.id)} className="text-destructive hover:text-destructive/80" aria-label="Delete Payment Method">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">No payment methods saved. Add one for faster checkout.</p>
      )}
    </div>
  );
}
