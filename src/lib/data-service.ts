// src/lib/data-service.ts
import { getDb } from '@/lib/mongodb';
import type { Product, Category, Review as ReviewType, Order, OrderItem } from './types';
import { ObjectId } from 'mongodb';

// --- Product Functions ---

export async function getProducts(searchParams?: { [key: string]: string | string[] | undefined }): Promise<Product[]> {
  const db = await getDb();
  const query: any = {};
  const sort: any = {};

  if (searchParams?.category) {
    // Assuming category is stored as a name string directly in products for now.
    // Ideally, it would be a categoryId. If we switch to categoryId, this needs update.
    query.category = searchParams.category as string;
  }
  if (searchParams?.petType) {
    query.petType = searchParams.petType as string; // Assumes petType is a string, adjust if it's an array in DB
  }
  if (searchParams?.search) {
    query.name = { $regex: new RegExp(searchParams.search as string, 'i') };
  }

  if (searchParams?.sort === 'price_asc') {
    sort.price = 1;
  } else if (searchParams?.sort === 'price_desc') {
    sort.price = -1;
  } else if (searchParams?.sort === 'rating_desc') {
    sort.rating = -1;
  } else if (searchParams?.sort === 'newest') {
    sort._id = -1; // Sort by insertion time (descending)
  }

  const productsFromDb = await db.collection('products').find(query).sort(sort).toArray();
  return productsFromDb.map(p => ({ ...p, id: p._id.toString() })) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!ObjectId.isValid(id)) {
    console.warn(`Invalid ObjectId: ${id} in getProductById`);
    return null;
  }
  const db = await getDb();
  const productFromDb = await db.collection('products').findOne({ _id: new ObjectId(id) });
  if (!productFromDb) return null;
  return { ...productFromDb, id: productFromDb._id.toString() } as Product;
}

export async function getFeaturedProducts(limit: number = 4): Promise<Product[]> {
  const db = await getDb();
  // Example: get highly rated or newest products. For now, just newest.
  const productsFromDb = await db.collection('products').find().sort({ _id: -1 }).limit(limit).toArray();
  return productsFromDb.map(p => ({ ...p, id: p._id.toString() })) as Product[];
}

export async function getRelatedProducts(currentProduct: Product, limit: number = 4): Promise<Product[]> {
  const db = await getDb();
  // Simple related: same category, not the product itself
  const query = { 
    category: currentProduct.category, 
    _id: { $ne: new ObjectId(currentProduct.id) } 
  };
  const productsFromDb = await db.collection('products').find(query).limit(limit).toArray();
  return productsFromDb.map(p => ({ ...p, id: p._id.toString() })) as Product[];
}

// --- Category Functions ---

export async function getCategories(): Promise<Category[]> {
  const db = await getDb();
  const categoriesFromDb = await db.collection('categories').find().toArray();
  return categoriesFromDb.map(c => ({ ...c, id: c._id.toString() })) as Category[];
}

export async function getCategoryDetails(idOrName: string): Promise<Category | null> {
  const db = await getDb();
  let categoryFromDb;
  if (ObjectId.isValid(idOrName)) {
    categoryFromDb = await db.collection('categories').findOne({ _id: new ObjectId(idOrName) });
  } else {
    // Fallback to finding by name if it's not a valid ObjectId
    categoryFromDb = await db.collection('categories').findOne({ name: idOrName });
  }
  if (!categoryFromDb) return null;
  return { ...categoryFromDb, id: categoryFromDb._id.toString() } as Category;
}

export async function getProductsByCategory(categoryName: string): Promise<Product[]> {
  const db = await getDb();
  // This assumes products have a 'category' field that is the category name.
  // If products store 'categoryId', this query needs to change.
  const productsFromDb = await db.collection('products').find({ category: categoryName }).toArray();
  return productsFromDb.map(p => ({ ...p, id: p._id.toString() })) as Product[];
}


// --- Review Functions (Still Mocked) ---
import { mockReviews } from './mock-data'; // Keep mock-data for reviews, orders for now

export async function getReviewsByProductId(productId: string): Promise<ReviewType[]> {
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
  return mockReviews.filter(r => r.productId === productId);
}

// --- Order Functions ---
// For now, using mockOrders from mock-data.ts, but modifying it.
// The OrderDetailPage will fetch product details for items.

export async function getOrderById(orderId: string): Promise<Order | null> {
  const { mockOrders } = await import('./mock-data'); // Dynamically import to avoid circular deps if mock-data uses this service
  await new Promise(resolve => setTimeout(resolve, 100));
  const order = mockOrders.find(o => o.id === orderId);
  if (!order) return null;
  
  // The items in mockOrders now store productId, priceAtPurchase, etc.
  // Product details like current name/image will be fetched on the page component.
  return order as Order; 
}


// --- Smart Cart Suggestions ---
export async function getSmartCartSuggestions(cartItems: { productId: string, quantity: number }[]): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

  if (cartItems.length === 0) {
    return [];
  }

  const db = await getDb();
  const cartProductIds = cartItems.map(item => new ObjectId(item.productId));
  
  // Fetch details of products in cart to get their categories/types
  const productsInCart = await db.collection('products').find({ _id: { $in: cartProductIds } }).toArray();
  const productsInCartMapped = productsInCart.map(p => ({...p, id: p._id.toString()})) as Product[];

  const suggestedProducts: Product[] = [];
  
  // Try to find a toy for a dog if dog food is in cart
  const hasDogFood = productsInCartMapped.some(p => p.category === 'Dog Food' && p.petType.includes('dog'));
  if (hasDogFood) {
    const dogToy = await db.collection('products').findOne({ category: 'Dog Toys', petType: 'dog', _id: { $nin: cartProductIds } });
    if (dogToy) suggestedProducts.push({ ...dogToy, id: dogToy._id.toString() } as Product);
  }

  // Try to find a treat if any food is in cart
  const hasAnyFood = productsInCartMapped.some(p => p.category.includes('Food'));
  if (hasAnyFood && suggestedProducts.length < 2) {
     const petTypesInCart = new Set(productsInCartMapped.flatMap(p => p.petType));
     const treat = await db.collection('products').findOne({ 
       category: { $regex: /Treats/i }, // Dog Treats, Cat Treats etc.
       petType: { $in: Array.from(petTypesInCart) },
       _id: { $nin: cartProductIds } 
     });
     if (treat) suggestedProducts.push({ ...treat, id: treat._id.toString() } as Product);
  }

  // Add some general popular items if not enough suggestions
  if (suggestedProducts.length < 2) {
    const popular = await db.collection('products').find({ _id: { $nin: cartProductIds } }).sort({ rating: -1 }).limit(2 - suggestedProducts.length).toArray();
    popular.forEach(p => {
        if (!suggestedProducts.find(sp => sp.id === p._id.toString())) {
             suggestedProducts.push({ ...p, id: p._id.toString() } as Product);
        }
    });
  }
  
  return suggestedProducts.slice(0,2);
}

// Example data structure for seeding:
/*
// products collection document example:
{
  // _id will be auto-generated by MongoDB
  name: 'Premium Dog Kibble - Chicken & Rice',
  description: 'High-quality dry food for adult dogs, made with real chicken and wholesome rice. Provides complete and balanced nutrition.',
  price: 29.99,
  imageUrl: 'https://placehold.co/600x400.png',
  category: 'Dog Food', // Or use categoryId if you prefer normalization
  categoryId: ObjectId("your_dog_food_category_object_id"), // Example if using categoryId
  petType: ['dog'],
  rating: 4.5,
  reviewsCount: 120,
  stock: 50,
  brand: 'Pawsitive Nutrition',
  features: ['Real chicken as first ingredient', 'No artificial colors or flavors', 'Supports healthy digestion'],
  dataAiHint: "dog kibble"
}

// categories collection document example:
{
  // _id will be auto-generated by MongoDB
  name: 'Dog Food',
  imageUrl: 'https://placehold.co/300x200.png',
  description: 'Nutritious food for your canine companion.',
  dataAiHint: "dog food"
}
*/
