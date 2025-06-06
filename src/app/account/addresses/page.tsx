
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit3, Trash2, MapPin, Loader2 } from 'lucide-react';
import type { Address } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth.tsx';
import { getUserAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '@/lib/data-service';


export default function AddressesPage() {
  const { toast } = useToast();
  const { currentUser, loading: authLoading } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [currentAddress, setCurrentAddress] = useState<Partial<Address>>({});

  const fetchAddresses = useCallback(async () => {
    if (!currentUser?.id) return;
    setIsLoadingAddresses(true);
    try {
      const userAddresses = await getUserAddresses(currentUser.id);
      setAddresses(userAddresses);
    } catch (error) {
      toast({ title: "Error", description: "Could not fetch addresses.", variant: "destructive" });
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [currentUser?.id, toast]);

  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchAddresses();
    }
  }, [authLoading, currentUser, fetchAddresses]);

  const openModalForNew = () => {
    setEditingAddress(null);
    setCurrentAddress({ country: 'USA' }); // Default country
    setIsModalOpen(true);
  };

  const openModalForEdit = (address: Address) => {
    setEditingAddress(address);
    setCurrentAddress({ ...address });
    setIsModalOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = async () => {
    if (!currentUser?.id) return;
    if (!currentAddress.street || !currentAddress.city || !currentAddress.state || !currentAddress.zipCode || !currentAddress.country) {
        toast({ title: "Missing Fields", description: "Please fill all required address fields.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    try {
      if (editingAddress && editingAddress.id) {
        const updated = await updateAddress(editingAddress.id, currentAddress);
        if (updated) {
          toast({ title: "Address Updated", description: "Your address has been successfully updated." });
          fetchAddresses(); // Re-fetch to get updated list
        } else {
          toast({ title: "Update Failed", description: "Could not update address.", variant: "destructive" });
        }
      } else {
        const newAddrData = { ...currentAddress, isDefault: addresses.length === 0 ? true : currentAddress.isDefault || false } as Omit<Address, 'id' | 'userId'>;
        const added = await addAddress(currentUser.id, newAddrData);
        if (added) {
          toast({ title: "Address Added", description: "New address has been successfully added." });
          fetchAddresses(); // Re-fetch
        } else {
           toast({ title: "Add Failed", description: "Could not add address.", variant: "destructive" });
        }
      }
      setIsModalOpen(false);
    } catch (error) {
       toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id?: string) => {
    if (!id) return;
    setIsSubmitting(true); // Consider separate loading state for delete
    try {
      const success = await deleteAddress(id);
      if (success) {
        toast({ title: "Address Deleted", description: "The address has been removed." });
        fetchAddresses(); // Re-fetch
      } else {
        toast({ title: "Delete Failed", description: "Could not remove address.", variant: "destructive" });
      }
    } catch (error) {
        toast({ title: "Error", description: "An unexpected error occurred during deletion.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (id?: string) => {
    if (!id || !currentUser?.id) return;
    setIsSubmitting(true); // Consider separate loading state
     try {
      const success = await setDefaultAddress(currentUser.id, id);
      if (success) {
        toast({ title: "Default Address Set", description: "This address is now your default." });
        fetchAddresses(); // Re-fetch
      } else {
        toast({ title: "Update Failed", description: "Could not set default address.", variant: "destructive" });
      }
    } catch (error) {
        toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (authLoading || isLoadingAddresses) {
    return <div className="text-center py-12"><Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" /> Loading addresses...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-semibold">Manage Addresses</h2>
            <p className="text-muted-foreground">Add, edit, or remove your shipping addresses.</p>
        </div>
        <Button onClick={openModalForNew} disabled={isSubmitting}>
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
                    <MapPin className="mr-2 h-5 w-5 text-primary" /> {address.fullName || `Address`}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                {!address.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id)} disabled={isSubmitting}>Set as Default</Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => openModalForEdit(address)} aria-label="Edit Address" disabled={isSubmitting}>
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(address.id)} className="text-destructive hover:text-destructive/80" aria-label="Delete Address" disabled={isSubmitting}>
                  {isSubmitting && editingAddress?.id === address.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4" />}
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
              <Input id="fullNameModal" name="fullName" value={currentAddress.fullName || ''} onChange={handleInputChange} placeholder="Home" disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" name="street" value={currentAddress.street || ''} onChange={handleInputChange} required disabled={isSubmitting} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={currentAddress.city || ''} onChange={handleInputChange} required disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" value={currentAddress.state || ''} onChange={handleInputChange} required disabled={isSubmitting} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input id="zipCode" name="zipCode" value={currentAddress.zipCode || ''} onChange={handleInputChange} required disabled={isSubmitting} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" value={currentAddress.country || 'USA'} onChange={handleInputChange} required disabled={isSubmitting} />
                 </div>
            </div>
             <div className="flex items-center space-x-2">
                <Input type="checkbox" id="isDefault" name="isDefault" checked={!!currentAddress.isDefault} onChange={(e) => setCurrentAddress(prev => ({ ...prev, isDefault: e.target.checked }))} disabled={isSubmitting} className="h-4 w-4"/>
                <Label htmlFor="isDefault">Set as default address</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleSaveAddress} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
