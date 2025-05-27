"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit3, Trash2, MapPin } from 'lucide-react';
import type { Address } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const initialAddresses: Address[] = [
  { street: '123 Cuddle Street', city: 'Warmville', state: 'PA', zipCode: '12345', country: 'USA', fullName: "Home", isDefault: true },
  { street: '456 Playful Path', city: 'Joytown', state: 'NY', zipCode: '67890', country: 'USA', fullName: "Work", isDefault: false },
];

interface ExtendedAddress extends Address {
    id?: string;
    isDefault?: boolean;
}


export default function AddressesPage() {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<ExtendedAddress[]>(initialAddresses.map((addr, i) => ({...addr, id: `addr-${i}`})));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ExtendedAddress | null>(null);
  const [currentAddress, setCurrentAddress] = useState<Partial<ExtendedAddress>>({});

  const openModalForNew = () => {
    setEditingAddress(null);
    setCurrentAddress({ country: 'USA' });
    setIsModalOpen(true);
  };

  const openModalForEdit = (address: ExtendedAddress) => {
    setEditingAddress(address);
    setCurrentAddress({...address});
    setIsModalOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = () => {
    if (!currentAddress.street || !currentAddress.city || !currentAddress.state || !currentAddress.zipCode) {
        toast({ title: "Missing Fields", description: "Please fill all required address fields.", variant: "destructive" });
        return;
    }

    if (editingAddress) {
      setAddresses(addresses.map(addr => addr.id === editingAddress.id ? {...editingAddress, ...currentAddress} : addr));
      toast({ title: "Address Updated", description: "Your address has been successfully updated." });
    } else {
      setAddresses([...addresses, { ...currentAddress, id: `addr-${Date.now()}` } as ExtendedAddress]);
      toast({ title: "Address Added", description: "New address has been successfully added." });
    }
    setIsModalOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    toast({ title: "Address Deleted", description: "The address has been removed." });
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({ ...addr, isDefault: addr.id === id })));
    toast({ title: "Default Address Set", description: "This address is now your default." });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-semibold">Manage Addresses</h2>
            <p className="text-muted-foreground">Add, edit, or remove your shipping addresses.</p>
        </div>
        <Button onClick={openModalForNew}>
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Address
        </Button>
      </div>

      {addresses.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card key={address.id} className={`shadow-md relative ${address.isDefault ? 'border-2 border-primary' : ''}`}>
              {address.isDefault && <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">Default</div>}
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-primary" /> {address.fullName || `Address ${address.id?.slice(-4)}`}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                {!address.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id!)}>Set as Default</Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => openModalForEdit(address)} aria-label="Edit Address">
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(address.id!)} className="text-destructive hover:text-destructive/80" aria-label="Delete Address">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">You have no saved addresses. Add one to get started!</p>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
            <DialogDescription>
              {editingAddress ? 'Update the details of your address.' : 'Enter the details for your new address.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullNameModal">Address Label (e.g. Home, Work)</Label>
              <Input id="fullNameModal" name="fullName" value={currentAddress.fullName || ''} onChange={handleInputChange} placeholder="Home" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" name="street" value={currentAddress.street || ''} onChange={handleInputChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={currentAddress.city || ''} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" value={currentAddress.state || ''} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input id="zipCode" name="zipCode" value={currentAddress.zipCode || ''} onChange={handleInputChange} required />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" value={currentAddress.country || 'USA'} onChange={handleInputChange} required />
                 </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveAddress}>Save Address</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
