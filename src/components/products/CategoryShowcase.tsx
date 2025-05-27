import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface CategoryShowcaseProps {
  categories: Category[];
  title?: string;
}

export default function CategoryShowcase({ categories, title = "Shop by Category" }: CategoryShowcaseProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {categories.map((category) => (
          <Link href={`/categories/${category.id}`} key={category.id} className="group">
            <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 text-center rounded-lg h-full flex flex-col">
              {category.imageUrl && (
                <CardHeader className="p-0 aspect-square relative w-full">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={category.dataAiHint || "pet category"}
                  />
                </CardHeader>
              )}
              <CardContent className="p-3 flex-grow flex flex-col justify-center">
                <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                  {category.name}
                </CardTitle>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
       <div className="text-center mt-8">
        <Link href="/categories" className="inline-flex items-center text-accent hover:text-accent/80 font-medium">
          View All Categories <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
