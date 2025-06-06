// "use client"; // Keep as server component for initial load, client for interactions.
// For simplicity, we'll make this a server component that fetches data,
// and client components can be used for interactions like "Add to Cart" if needed, or use Server Actions.
// For now, "Add to cart" will remain a client-side toast. Review submission will also be client-side mock.

import { Suspense } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductById, getReviewsByProductId, getRelatedProducts } from '@/lib/data-service';
import type { Product as ProductType, Review as ReviewType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Star, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ProductList from '@/components/products/ProductList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assuming Select component is available
import ProductInteractions from './ProductInteractions'; // New client component

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const product = await getProductById(id);

  if (!product) {
    notFound(); // Triggers the not-found page
  }

  // Fetch reviews and related products in parallel
  const [reviews, relatedProducts] = await Promise.all([
    getReviewsByProductId(product.id), // Still uses mock reviews
    getRelatedProducts(product, 4)
  ]);

  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square relative w-full rounded-lg overflow-hidden shadow-lg mb-4">
            <Image
              src={product.imageUrl || "https://placehold.co/600x400.png"} // Fallback
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-opacity duration-300"
              data-ai-hint={product.dataAiHint || "pet product detail"}
            />
          </div>
          {/* Thumbnails (if multiple images via variants) */}
           {product.variants && product.variants.filter(v => v.imageUrl).length > 0 && (
            <div className="flex space-x-2">
              {/* Logic for activeImage will be in ProductInteractions or simplified */}
              {[product.imageUrl, ...product.variants.map(v => v.imageUrl).filter(Boolean)].map((imgUrl, idx) => (
                <button key={idx} /* onClick={() => setActiveImage(imgUrl as string)} */ className={`w-20 h-20 relative rounded-md overflow-hidden border-2 border-transparent hover:border-primary transition`}>
                   <Image src={imgUrl as string} alt={`${product.name} thumbnail ${idx+1}`} fill className="object-cover" data-ai-hint={product.dataAiHint || "product thumbnail"}/>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">{product.name}</h1>
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${i < Math.round(product.rating) ? 'text-accent fill-accent' : 'text-gray-300'}`}
              />
            ))}
            <span className="text-muted-foreground">({product.reviewsCount} reviews)</span>
          </div>
          <p className="text-3xl font-semibold text-foreground">${product.price.toFixed(2)}</p>
          <p className="text-foreground/80 leading-relaxed">{product.description}</p>
          
          {product.brand && <p className="text-sm text-muted-foreground">Brand: <span className="font-medium text-foreground">{product.brand}</span></p>}
          <p className="text-sm text-muted-foreground">Availability: <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}</span></p>

          {/* Variants (if any) - simplified for server component */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <h3 className="text-md font-semibold mb-2">Options:</h3>
              <Select>
                <SelectTrigger className="w-full md:w-[200px]">
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
          {/* Client component for quantity, add to cart, active image */}
          <ProductInteractions product={product} />
        </div>
      </div>

      <Separator className="my-12" />

      {/* Product Details & Reviews Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex mb-6">
          <TabsTrigger value="details">Full Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="prose max-w-none prose-sm sm:prose-base">
          <h3 className="text-xl font-semibold mb-4">Product Features</h3>
          {product.features && product.features.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          ) : (
            <p>No specific features listed.</p>
          )}
        </TabsContent>
        <TabsContent value="reviews">
            {/* Review submission and display logic needs to be client-side or use Server Actions */}
            <ProductReviewSection productId={product.id} initialReviews={reviews} />
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
            <h2 className="text-3xl font-bold text-primary mb-8">Related Products</h2>
            <ProductList products={relatedProducts} />
        </div>
      )}
    </div>
  );
}


// New Client Component for Reviews
// src/app/products/[id]/ProductReviewSection.tsx (You'd create this file)
// For now, I'll inline a simplified version here for brevity if it's small,
// otherwise, I should instruct to create a new file.
// Given the complexity, let's assume ProductReviewSection is a new client component.

function ProductReviewSection({ productId, initialReviews }: { productId: string; initialReviews: ReviewType[] }) {
  // This would be a client component ('use client')
  // const [reviews, setReviews] = useState<ReviewType[]>(initialReviews);
  // const [newReviewRating, setNewReviewRating] = useState(0);
  // const [newReviewComment, setNewReviewComment] = useState('');
  // const { toast } = useToast();

  // const handleReviewSubmit = (e: React.FormEvent) => { ... };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
        {initialReviews.length > 0 ? (
          initialReviews.map(review => (
            <Card key={review.id} className="shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{review.userName}</CardTitle>
                    <p className="text-xs text-muted-foreground">Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-accent fill-accent' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/90">{review.comment}</p>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground flex justify-between items-center">
                <span>Was this review helpful?</span>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm"><ThumbsUp className="w-4 h-4 mr-1" /> Yes</Button>
                  <Button variant="ghost" size="sm"><ThumbsDown className="w-4 h-4 mr-1" /> No</Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>No reviews yet. Be the first to review this product!</p>
        )}
      </div>
      {/* Write a Review Form - this part needs 'use client' */}
      <div className="md:col-span-1">
          <Card className="shadow p-6">
              <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl">Write a Review</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                  <form /*onSubmit={handleReviewSubmit}*/ className="space-y-4">
                      <div>
                          <Label htmlFor="reviewRating" className="mb-1 block">Your Rating:</Label>
                          <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                  <button type="button" key={star} /*onClick={() => setNewReviewRating(star)}*/ aria-label={`Rate ${star} stars`}>
                                      <Star className={`w-7 h-7 cursor-pointer transition-colors text-gray-300 hover:text-accent/70`} />
                                  </button>
                              ))}
                          </div>
                      </div>
                      <div>
                          <Label htmlFor="reviewComment">Your Review:</Label>
                          <Textarea
                              id="reviewComment"
                              // value={newReviewComment}
                              // onChange={(e) => setNewReviewComment(e.target.value)}
                              placeholder="Share your thoughts about the product..."
                              rows={4}
                          />
                      </div>
                      <Button type="submit" className="w-full">Submit Review</Button>
                  </form>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}

// You would need to create src/app/products/[id]/ProductInteractions.tsx
// This component would handle client-side state for quantity, add to cart action.
// Example (simplified, without active image logic for now):
/*
// src/app/products/[id]/ProductInteractions.tsx
"use client";

import { useState } from 'react';
import type { Product as ProductType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProductInteractions({ product }: { product: ProductType }) {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart!",
      description: `${product.name} (x${quantity}) has been added to your cart.`,
    });
    // Here you would typically update a global cart state or call an API
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        <Label htmlFor="quantity" className="text-sm font-medium">Quantity:</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
          className="w-20 h-10 text-center"
          disabled={product.stock === 0}
        />
      </div>
      <Button size="lg" onClick={handleAddToCart} disabled={product.stock === 0} className="w-full md:w-auto">
        <ShoppingCart className="mr-2 h-5 w-5" /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </Button>
    </>
  );
}
*/
