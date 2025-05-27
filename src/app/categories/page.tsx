import CategoryShowcase from '@/components/products/CategoryShowcase';
import { mockCategories } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tag } from 'lucide-react';

export default function AllCategoriesPage() {
  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="text-center mb-12">
        <Tag className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          All Pet Categories
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore products tailored for every type of pet. From dog essentials to exotic reptile care, find what you need.
        </p>
      </div>
      
      <CategoryShowcase categories={mockCategories} title="Browse Our Categories" />

      <div className="mt-16 text-center">
        <p className="text-muted-foreground mb-4">Can't find what you're looking for?</p>
        <Button size="lg" asChild>
          <Link href="/products">Shop All Products</Link>
        </Button>
      </div>
    </div>
  );
}
