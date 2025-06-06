import ProductList from '@/components/products/ProductList';
import CategoryShowcase from '@/components/products/CategoryShowcase';
import { getFeaturedProducts, getCategories } from '@/lib/data-service';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Zap } from 'lucide-react';

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(4);
  const displayedCategories = await getCategories(); // Fetch all, CategoryShowcase might limit display or add a "view all" link. Consider limiting here if too many: .slice(0,6)

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 via-background to-accent/10 py-20 px-4 rounded-xl overflow-hidden">
        <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-6">
              Give Your Pets the Best!
            </h1>
            <p className="text-lg text-foreground/80 mb-8">
              Discover a wide range of quality pet supplies, food, toys, and accessories.
              Everything your furry friend desires, all in one place.
            </p>
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/products">Shop All Products</Link>
            </Button>
          </div>
          <div className="relative h-64 md:h-96">
            <Image
              src="https://placehold.co/800x500.png"
              alt="Happy pets playing"
              fill
              className="object-contain rounded-lg"
              data-ai-hint="dog cat playing"
              priority
            />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Featured Products</h2>
          <Button variant="outline" asChild>
            <Link href="/products">View All</Link>
          </Button>
        </div>
        <ProductList products={featuredProducts} />
      </section>

      {/* Categories Section */}
      <CategoryShowcase categories={displayedCategories.slice(0,6)} /> {/* Displaying first 6, CategoryShowcase has "View All" */}

      {/* Special Offer/Call to Action Section */}
      <section className="bg-card p-8 md:p-12 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <Zap className="w-12 h-12 text-accent mb-4 mx-auto md:mx-0" />
            <h3 className="text-2xl font-bold text-primary mb-2">New Arrivals Daily!</h3>
            <p className="text-foreground/70 mb-6">
              Check out the latest products and special deals updated every day. Don't miss out!
            </p>
            <Button asChild>
              <Link href="/products?sort=newest">Shop New Arrivals</Link>
            </Button>
          </div>
          <div className="w-full md:w-1/3 h-48 md:h-64 relative">
             <Image
                src="https://placehold.co/400x300.png"
                alt="New pet products"
                fill
                className="object-cover rounded-lg"
                data-ai-hint="new pet products"
              />
          </div>
        </div>
      </section>
    </div>
  );
}
