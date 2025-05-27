import ProductList from '@/components/products/ProductList';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import type { Product, Category } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

async function getCategoryDetails(id: string): Promise<Category | undefined> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  // The ID in mockCategories is like 'cat-food', the page param might be 'Dog%20Food'
  // For robust matching, consider slugs or more consistent IDs. Here, we'll find by name.
  const decodedId = decodeURIComponent(id);
  return mockCategories.find(cat => cat.name.toLowerCase() === decodedId.toLowerCase() || cat.id === decodedId);
}

async function getProductsByCategory(categoryName: string): Promise<Product[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockProducts.filter(product => product.category.toLowerCase() === categoryName.toLowerCase());
}

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const category = await getCategoryDetails(params.id);

  if (!category) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-semibold">Category Not Found</h1>
        <p className="text-muted-foreground mt-2">The category you're looking for doesn't exist.</p>
        <Button variant="link" asChild className="mt-4">
            <Link href="/categories"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Categories</Link>
        </Button>
      </div>
    );
  }

  const products = await getProductsByCategory(category.name);

  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="mb-8 md:mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">{category.name}</h1>
        {category.description && <p className="text-lg text-muted-foreground mt-2 max-w-xl mx-auto">{category.description}</p>}
      </div>

      {products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <div className="text-center py-12">
            <h2 className="text-2xl font-semibold">No Products Found</h2>
            <p className="text-muted-foreground mt-2">There are currently no products in the {category.name} category.</p>
        </div>
      )}
      
      <div className="mt-12 text-center">
        <Button variant="outline" asChild>
          <Link href="/categories"><ArrowLeft className="mr-2 h-4 w-4" /> Browse Other Categories</Link>
        </Button>
      </div>
    </div>
  );
}

// This function can be used to generate static paths if using SSG
export async function generateStaticParams() {
  return mockCategories.map((category) => ({
    id: encodeURIComponent(category.id), // or category.name if using name in URL
  }));
}
