import ProductList from '@/components/products/ProductList';
import { getProducts, getCategories } from '@/lib/data-service'; // Updated import
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search, ListFilter } from 'lucide-react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const petTypes = ['dog', 'cat', 'bird', 'fish', 'small_animal', 'reptile'];

export default async function ProductsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const products = await getProducts(searchParams); // Uses data-service now
  const categories = await getCategories(); // Fetch categories for filter
  const currentCategory = searchParams?.category as string || "All";

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary">Our Products</h1>
        <p className="text-lg text-muted-foreground mt-2">Find everything your pet needs right here.</p>
      </div>

      {/* Filters and Search */}
      {/* TODO: This form needs to be functional, likely by navigating with query params on submit/change */}
      <form method="GET" action="/products" className="mb-8 p-6 bg-card rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="search" placeholder="Search products..." className="pl-10 w-full" defaultValue={searchParams?.search as string || ""} name="search" />
          </div>

          <Select name="sort" defaultValue={searchParams?.sort as string || "relevance"}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating_desc">Avg. Customer Review</SelectItem>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="md:hidden">
             <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <ListFilter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px] bg-card">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your product search.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  <FilterSection title="Categories">
                    {categories.map(cat => (
                      <FilterLink key={cat.id} href={`/products?category=${encodeURIComponent(cat.name)}`} isActive={currentCategory === cat.name}>{cat.name}</FilterLink>
                    ))}
                     <FilterLink href="/products" isActive={currentCategory === "All"}>All Categories</FilterLink>
                  </FilterSection>
                  <Separator />
                  <FilterSection title="Pet Type">
                     {petTypes.map(pt => (
                        <div key={pt} className="flex items-center space-x-2">
                          <Checkbox id={`filter-pet-${pt}`} name="petType" value={pt} defaultChecked={searchParams?.petType === pt} />
                          <Label htmlFor={`filter-pet-${pt}`} className="capitalize">{pt.replace('_', ' ')}</Label>
                        </div>
                      ))}
                  </FilterSection>
                  <Button type="submit" className="w-full mt-4">Apply Filters</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
           <Button type="submit" className="hidden md:inline-flex">Apply</Button>
        </div>
      </form>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden md:block w-full md:w-1/4 lg:w-1/5 p-6 bg-card rounded-lg shadow self-start sticky top-24">
           <form method="GET" action="/products">
             {/* Hidden input for current search and sort to persist them when changing category/petType */}
            {searchParams?.search && <input type="hidden" name="search" value={searchParams.search as string} />}
            {searchParams?.sort && <input type="hidden" name="sort" value={searchParams.sort as string} />}

            <h3 className="text-xl font-semibold mb-4 text-primary flex items-center">
                <Filter className="mr-2 h-5 w-5" /> Filters
            </h3>
            <FilterSection title="Categories">
                {categories.map(cat => (
                    <FilterLinkInput key={cat.id} name="category" value={cat.name} currentCategory={currentCategory} label={cat.name} />
                ))}
                <FilterLinkInput name="category" value="" currentCategory={currentCategory} label="All Categories" isAllCategories />
            </FilterSection>
            <Separator className="my-6" />
            <FilterSection title="Pet Type">
                {petTypes.map(pt => (
                    <div key={pt} className="flex items-center space-x-2">
                    <Checkbox id={`filter-pet-desktop-${pt}`} name="petType" value={pt} defaultChecked={searchParams?.petType === pt} />
                    <Label htmlFor={`filter-pet-desktop-${pt}`} className="capitalize">{pt.replace('_', ' ')}</Label>
                    </div>
                ))}
            </FilterSection>
            <Button type="submit" className="w-full mt-6">Apply Filters</Button>
           </form>
        </aside>

        {/* Product Grid */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          {products.length > 0 ? (
            <ProductList products={products} />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">No Products Found</h2>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms.</p>
              <Button asChild>
                <Link href="/products">Clear Filters</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-lg font-medium mb-3 text-foreground">{title}</h4>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

function FilterLink({ href, children, isActive }: { href: string, children: React.ReactNode, isActive?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`block text-sm hover:text-primary transition-colors ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
    >
      {children}
    </Link>
  );
}

// Component for filter links that are part of the form
function FilterLinkInput({ name, value, currentCategory, label, isAllCategories = false }: { name: string, value: string, currentCategory: string | undefined, label: string, isAllCategories?: boolean }) {
  const isActive = isAllCategories ? (!currentCategory || currentCategory === "All") : currentCategory === value;
  return (
    <label className={`block text-sm cursor-pointer hover:text-primary transition-colors ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
      <input type="radio" name={name} value={value} defaultChecked={isActive} className="sr-only" onChange={(e) => e.target.form?.requestSubmit()} />
      {label}
    </label>
  );
}
