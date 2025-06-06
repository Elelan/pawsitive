import ProductList from '@/components/products/ProductList';
import { getCategoryDetails, getProductsByCategory } from '@/lib/data-service'; // Updated imports
import type { Product, Category } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

// This function can be used to generate static paths if using SSG,
// but it needs to fetch from DB now.
// export async function generateStaticParams() {
//   const categories = await getCategories(); // Assuming getCategories is available
//   return categories.map((category) => ({
//     id: category.id, // or category.name if using name in URL
//   }));
// }


export default async function CategoryPage({ params }: { params: { id: string } }) {
  const category = await getCategoryDetails(params.id); // params.id could be name or ObjectId string

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(category.name); // Fetches by category name

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
