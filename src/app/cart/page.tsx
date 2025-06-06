// src/app/cart/page.tsx
"use client"; 

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { CartItem as CartItemType, Product } from '@/lib/types';
// import { getSmartCartSuggestions } from '@/lib/mock-data'; // Old import
import { getSmartCartSuggestions, getProductById } from '@/lib/data-service'; // New import
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, PlusCircle, MinusCircle, Gift, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CART_STORAGE_KEY = 'pawsitiveCartItems'; // For storing actual cart items
const CART_COUNT_STORAGE_KEY = 'pawsitiveCartCount'; // Kept for header, but cart itself is source of truth

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const { toast } = useToast();

  // Load cart from localStorage
  useEffect(() => {
    setIsLoadingCart(true);
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      // Potentially clear corrupted cart storage
      // localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setIsLoadingCart(false);
    }
  }, []);

  // Update localStorage and cart count when cartItems change
  useEffect(() => {
    if (!isLoadingCart) { // Only save after initial load
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        localStorage.setItem(CART_COUNT_STORAGE_KEY, totalQuantity.toString());
        window.dispatchEvent(new CustomEvent('storage', { detail: { key: CART_COUNT_STORAGE_KEY } })); // For header
        window.dispatchEvent(new CustomEvent('cartUpdated')); // Generic cart update event
      } catch (error) {
        console.warn("Could not update cart in localStorage", error);
      }
    }
  }, [cartItems, isLoadingCart]);


  const fetchSuggestions = useCallback(async () => {
    if (cartItems.length > 0) {
      setIsLoadingSuggestions(true);
      try {
        const cartForSuggestions = cartItems.map(item => ({ productId: item.product.id, quantity: item.quantity }));
        const suggestions = await getSmartCartSuggestions(cartForSuggestions);
        setSuggestedProducts(suggestions);
      } catch (error) {
        console.error("Error fetching smart cart suggestions:", error);
        toast({ title: "Error", description: "Could not load smart suggestions.", variant: "destructive" });
      } finally {
        setIsLoadingSuggestions(false);
      }
    } else {
      setSuggestedProducts([]);
    }
  }, [cartItems, toast]);

  useEffect(() => {
    if(!isLoadingCart){ // Fetch suggestions after cart is loaded
        fetchSuggestions();
    }
  }, [fetchSuggestions, isLoadingCart]);


  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }
    setCartItems(
      cartItems.map(item =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (productId: string) => {
    const removedItem = cartItems.find(item => item.product.id === productId);
    setCartItems(cartItems.filter(item => item.product.id !== productId));
    if (removedItem) {
        toast({ title: "Item Removed", description: `${removedItem.product.name} removed from cart.` });
    }
  };
  
  const addSuggestedItemToCart = async (productToAdd: Product) => {
    // Fetch full product details if not already robust in 'productToAdd'
    // (getSmartCartSuggestions should return full Product objects)
    const productDetails = productToAdd.description ? productToAdd : await getProductById(productToAdd.id);

    if (!productDetails) {
        toast({ title: "Error", description: "Could not add item to cart.", variant: "destructive" });
        return;
    }

    setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.product.id === productDetails.id);
        if (existingItem) {
            return prevItems.map(item =>
                item.product.id === productDetails.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        }
        return [...prevItems, { product: productDetails, productId: productDetails.id, quantity: 1 }];
    });
    toast({ title: "Added to cart!", description: `${productDetails.name} added.` });
  };


  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const taxRate = 0.08; 
  const taxes = subtotal * taxRate;
  const total = subtotal + taxes;

  if (isLoadingCart) {
    return (
      <div className="container mx-auto py-12 text-center">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6 animate-pulse" />
        <h1 className="text-3xl font-bold text-primary mb-4">Loading Your Cart...</h1>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-12 text-center">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold text-primary mb-4">Your Cart is Empty</h1>
        <p className="text-lg text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button size="lg" asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">Your Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map(item => (
            <Card key={item.product.id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4 shadow-sm rounded-lg">
              <div className="relative w-full sm:w-24 h-24 aspect-square rounded-md overflow-hidden shrink-0">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  sizes="100px"
                  className="object-cover"
                  data-ai-hint={item.product.dataAiHint || "cart item"}
                />
              </div>
              <div className="flex-grow">
                <Link href={`/products/${item.product.id}`} className="hover:text-primary transition-colors">
                  <h2 className="text-lg font-semibold">{item.product.name}</h2>
                </Link>
                <p className="text-sm text-muted-foreground">{item.product.category}</p>
                <p className="text-md font-semibold text-primary mt-1">${item.product.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-3 shrink-0 mt-4 sm:mt-0">
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} aria-label="Decrease quantity">
                  <MinusCircle className="h-5 w-5" />
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                  min="1"
                  className="w-16 h-10 text-center"
                  aria-label="Item quantity"
                />
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} aria-label="Increase quantity">
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeItem(item.product.id)} className="text-destructive hover:text-destructive/80 shrink-0 mt-4 sm:mt-0 sm:ml-4" aria-label="Remove item">
                <Trash2 className="h-5 w-5" />
              </Button>
            </Card>
          ))}
        </div>

        {/* Order Summary & AI Suggestions */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes ({(taxRate * 100).toFixed(0)}%)</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Gift className="mr-2 h-6 w-6 text-accent" />
                Smart Suggestions
              </CardTitle>
              <p className="text-sm text-muted-foreground">Don't forget these essentials!</p>
            </CardHeader>
            <CardContent>
              {isLoadingSuggestions ? (
                <p className="text-muted-foreground text-center py-4">Loading suggestions...</p>
              ) : suggestedProducts.length > 0 ? (
                <div className="space-y-4">
                  {suggestedProducts.map(product => (
                    <div key={product.id} className="flex items-center gap-3 border p-3 rounded-md hover:shadow-md transition-shadow">
                        <div className="relative w-16 h-16 aspect-square rounded-md overflow-hidden shrink-0">
                            <Image src={product.imageUrl} alt={product.name} fill sizes="64px" className="object-cover" data-ai-hint={product.dataAiHint || "suggested item"} />
                        </div>
                        <div className="flex-grow">
                            <Link href={`/products/${product.id}`} className="text-sm font-medium hover:text-primary">{product.name}</Link>
                            <p className="text-xs text-primary font-semibold">${product.price.toFixed(2)}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => addSuggestedItemToCart(product)}>Add</Button>
                    </div>
                  ))}
                </div>
              ) : (
                 cartItems.length > 0 && <p className="text-muted-foreground text-center py-4">No specific suggestions right now, but check out our <Link href="/products?sort=popular" className="text-primary hover:underline">popular items</Link>!</p>
              )}
               {!cartItems.length && <p className="text-muted-foreground text-center py-4">Add items to your cart to see suggestions!</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
