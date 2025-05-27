"use client"; // For useState, useEffect, event handlers

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import type { Product, Review as ReviewType } from '@/lib/types';
import { mockProducts, mockReviews } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Star, MessageSquare, ThumbsUp, ThumbsDown, Edit3, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ProductList from '@/components/products/ProductList';

// Mock function to get product by ID
const getProductById = async (id: string): Promise<Product | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
  return mockProducts.find(p => p.id === id);
};

const getReviewsByProductId = async (productId: string): Promise<ReviewType[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockReviews.filter(r => r.productId === productId);
};

const getRelatedProducts = async (currentProduct: Product): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProducts.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id).slice(0, 4);
}


export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | undefined>(undefined);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');


  useEffect(() => {
    if (id) {
      const fetchProductData = async () => {
        const productData = await getProductById(id);
        if (productData) {
          setProduct(productData);
          setActiveImage(productData.imageUrl);
          const reviewData = await getReviewsByProductId(id);
          setReviews(reviewData);
          const relatedData = await getRelatedProducts(productData);
          setRelatedProducts(relatedData);
        }
      };
      fetchProductData();
    }
  }, [id]);

  if (!product) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-semibold">Loading product details...</h1>
      </div>
    );
  }

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart!",
      description: `${product.name} (x${quantity}) has been added to your cart.`,
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewRating === 0 || newReviewComment.trim() === '') {
        toast({ title: "Incomplete Review", description: "Please provide a rating and comment.", variant: "destructive" });
        return;
    }
    // Mock submitting review
    const newReview: ReviewType = {
        id: `r${Date.now()}`,
        productId: product.id,
        userId: 'currentUser', // Replace with actual user ID
        userName: 'You', // Replace with actual user name
        rating: newReviewRating,
        comment: newReviewComment,
        createdAt: new Date().toISOString().split('T')[0],
    };
    setReviews(prevReviews => [newReview, ...prevReviews]);
    setNewReviewRating(0);
    setNewReviewComment('');
    toast({ title: "Review Submitted!", description: "Thank you for your feedback." });
  };

  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square relative w-full rounded-lg overflow-hidden shadow-lg mb-4">
            <Image
              src={activeImage || product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-opacity duration-300"
              data-ai-hint={product.dataAiHint || "pet product detail"}
            />
          </div>
          {/* Thumbnails (if multiple images) */}
          {product.variants && product.variants.filter(v => v.imageUrl).length > 0 && (
            <div className="flex space-x-2">
              {[product.imageUrl, ...product.variants.map(v => v.imageUrl).filter(Boolean)].map((imgUrl, idx) => (
                <button key={idx} onClick={() => setActiveImage(imgUrl as string)} className={`w-20 h-20 relative rounded-md overflow-hidden border-2 ${activeImage === imgUrl ? 'border-primary' : 'border-transparent'} hover:border-primary transition`}>
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

          {/* Variants (if any) - simplified */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <h3 className="text-md font-semibold mb-2">Options:</h3>
              {/* This is a simplified variant selector. A real app would have more complex logic. */}
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
          {/* Add more detailed description if available */}
        </TabsContent>
        <TabsContent value="reviews">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
              {reviews.length > 0 ? (
                reviews.map(review => (
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
            {/* Write a Review Form */}
            <div className="md:col-span-1">
                <Card className="shadow p-6">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-xl">Write a Review</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="reviewRating" className="mb-1 block">Your Rating:</Label>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button type="button" key={star} onClick={() => setNewReviewRating(star)} aria-label={`Rate ${star} stars`}>
                                            <Star className={`w-7 h-7 cursor-pointer transition-colors ${star <= newReviewRating ? 'text-accent fill-accent' : 'text-gray-300 hover:text-accent/70'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="reviewComment">Your Review:</Label>
                                <Textarea
                                    id="reviewComment"
                                    value={newReviewComment}
                                    onChange={(e) => setNewReviewComment(e.target.value)}
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
