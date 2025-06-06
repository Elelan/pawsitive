"use client";

import { useState } from 'react';
import type { Product as ProductType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image'; // For active image logic if needed
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProductInteractions({ product }: { product: ProductType }) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | undefined>(product.imageUrl);
  // Add state for selected variant if applicable, e.g.
  // const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const { toast } = useToast();

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart!",
      description: `${product.name} (x${quantity}) has been added to your cart.`,
      // In a real app, you'd also provide productId and quantity to a cart update function
    });
    // Here you would typically update a global cart state, call a server action, or an API
    // Example: updateCart({ productId: product.id, quantity });
  };

  // Example function to handle variant selection
  // const handleVariantChange = (variantValue: string) => {
  //   const variant = product.variants?.find(v => v.value === variantValue);
  //   if (variant) {
  //     setSelectedVariant(variant);
  //     if (variant.imageUrl) {
  //       setActiveImage(variant.imageUrl);
  //     }
  //     // Potentially update price display based on variant.priceModifier
  //   }
  // };


  return (
    <>
      {/* Active Image Display (if handling active image client-side) */}
      {/* This part is a bit redundant if the parent server component already shows the main image.
          You might only need this if thumbnails exclusively control a client-side active image.
      <div className="aspect-square relative w-full rounded-lg overflow-hidden shadow-lg mb-4 md:hidden">
        <Image
          src={activeImage || product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-opacity duration-300"
        />
      </div>
      */}
      
      {/* Thumbnails for client-side active image switching (if needed) */}
      {/* 
      {product.variants && product.variants.filter(v => v.imageUrl).length > 0 && (
        <div className="flex space-x-2 mb-4">
          {[product.imageUrl, ...product.variants.map(v => v.imageUrl).filter(Boolean)].map((imgUrl, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveImage(imgUrl as string)} 
              className={`w-20 h-20 relative rounded-md overflow-hidden border-2 ${activeImage === imgUrl ? 'border-primary' : 'border-transparent'} hover:border-primary transition`}
            >
               <Image src={imgUrl as string} alt={`${product.name} thumbnail ${idx+1}`} fill className="object-cover" data-ai-hint={product.dataAiHint || "product thumbnail"}/>
            </button>
          ))}
        </div>
      )}
      */}

      {/* Variant Selector (client-side if needed for dynamic price/image updates) */}
      {/*
      {product.variants && product.variants.length > 0 && (
        <div className="mb-4">
          <Label htmlFor="variant-select" className="text-md font-semibold mb-2 block">{product.variants[0].name || 'Options'}:</Label>
          <Select onValueChange={handleVariantChange} defaultValue={product.variants[0].value}>
            <SelectTrigger id="variant-select" className="w-full md:w-[200px]">
              <SelectValue placeholder={`Select ${product.variants[0].name}`} />
            </SelectTrigger>
            <SelectContent>
              {product.variants.map(variant => (
                <SelectItem key={variant.id} value={variant.value}>
                  {variant.value} {variant.priceModifier ? `(${variant.priceModifier > 0 ? '+' : ''}${variant.priceModifier.toFixed(2)})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      */}

      <div className="flex items-center space-x-4 my-4">
        <Label htmlFor="quantity" className="text-sm font-medium">Quantity:</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          max={product.stock > 0 ? product.stock : 1} // Ensure max is at least 1 even if stock is 0 to avoid issues, disabled state handles it
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
          className="w-20 h-10 text-center"
          disabled={product.stock === 0}
        />
      </div>
      <Button 
        size="lg" 
        onClick={handleAddToCart} 
        disabled={product.stock === 0} 
        className="w-full md:w-auto"
        aria-label={`Add ${product.name} to cart`}
      >
        <ShoppingCart className="mr-2 h-5 w-5" /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </Button>
    </>
  );
}
