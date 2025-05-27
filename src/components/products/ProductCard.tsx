"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();

  const handleAddToCart = () => {
    // Basic add to cart logic for demonstration
    // In a real app, this would update a global cart state
    console.log(`Added ${product.name} to cart`);
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });
    // Here you could add the 'wagging tail' animation if desired
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full rounded-lg">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="block">
          <div className="aspect-[4/3] relative w-full">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
              data-ai-hint={product.dataAiHint || "pet product"}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.id}`}>
          <CardTitle className="text-lg font-semibold hover:text-primary transition-colors mb-1 leading-tight h-12 overflow-hidden">
            {product.name}
          </CardTitle>
        </Link>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Star className="w-4 h-4 fill-accent text-accent mr-1" />
          <span>{product.rating.toFixed(1)} ({product.reviewsCount} reviews)</span>
        </div>
        <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button onClick={handleAddToCart} className="w-full" aria-label={`Add ${product.name} to cart`}>
          <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
