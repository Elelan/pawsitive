
import prisma from '@/lib/prisma';
import type { Product, Category, Review as ReviewType, Order, OrderItem, PetType } from './types';
import type { Product as PrismaProduct, Category as PrismaCategory, Review as PrismaReview, Order as PrismaOrder, OrderItem as PrismaOrderItem, User as PrismaUser } from '@prisma/client';

// Helper to convert Prisma dates to ISO strings and map IDs
function mapPrismaDatesAndId<T extends { id: any; createdAt?: Date; updatedAt?: Date }>(item: T | null): (Omit<T, 'createdAt' | 'updatedAt'> & { createdAt?: string; updatedAt?: string }) | null {
  if (!item) return null;
  const { createdAt, updatedAt, ...rest } = item;
  return {
    ...rest,
    id: String(item.id), // Ensure ID is string
    ...(createdAt && { createdAt: createdAt.toISOString() }),
    ...(updatedAt && { updatedAt: updatedAt.toISOString() }),
  };
}

function mapPrismaDatesAndIdArray<T extends { id: any; createdAt?: Date; updatedAt?: Date }>(items: T[]): (Omit<T, 'createdAt' | 'updatedAt'> & { createdAt?: string; updatedAt?: string })[] {
  return items.map(item => mapPrismaDatesAndId(item)!).filter(Boolean) as (Omit<T, 'createdAt' | 'updatedAt'> & { createdAt?: string; updatedAt?: string })[];
}


// --- Product Functions ---
export async function getProducts(searchParams?: { [key: string]: string | string[] | undefined }): Promise<Product[]> {
  const queryOptions: any = { where: {}, orderBy: {} };

  if (searchParams?.category) {
    // Find category by name to get its ID, then filter products by categoryId
    const category = await prisma.category.findUnique({ where: { name: searchParams.category as string } });
    if (category) {
      queryOptions.where.categoryId = category.id;
    } else {
      return []; // Category not found, so no products for this category
    }
  }
  if (searchParams?.petType) {
    queryOptions.where.petType = { has: searchParams.petType as string };
  }
  if (searchParams?.search) {
    queryOptions.where.name = { contains: searchParams.search as string, mode: 'insensitive' };
  }

  if (searchParams?.sort === 'price_asc') {
    queryOptions.orderBy.price = 'asc';
  } else if (searchParams?.sort === 'price_desc') {
    queryOptions.orderBy.price = 'desc';
  } else if (searchParams?.sort === 'rating_desc') {
    queryOptions.orderBy.rating = 'desc';
  } else if (searchParams?.sort === 'newest') {
    queryOptions.orderBy.createdAt = 'desc';
  }

  const productsFromDb = await prisma.product.findMany(queryOptions);
  return mapPrismaDatesAndIdArray(productsFromDb) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const productFromDb = await prisma.product.findUnique({
      where: { id },
      include: { category: true /*, variants: true (if variants become a separate model) */ },
    });
    if (!productFromDb) return null;
    
    const mappedProduct = mapPrismaDatesAndId(productFromDb);
    if (mappedProduct && productFromDb.category) {
      (mappedProduct as Product).category = mapPrismaDatesAndId(productFromDb.category) as Category;
    }
    return mappedProduct as Product | null;

  } catch (error) {
    console.error(`Error fetching product by ID ${id}:`, error);
    return null; // Invalid ID format for ObjectId will throw error
  }
}

export async function getFeaturedProducts(limit: number = 4): Promise<Product[]> {
  const productsFromDb = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }, // Example: newest products
    // Or: orderBy: { rating: 'desc' }, // Example: highest rated
    take: limit,
    include: { category: true },
  });
  return mapPrismaDatesAndIdArray(productsFromDb).map(p => ({
    ...p,
    category: p.category ? mapPrismaDatesAndId(p.category as any) as Category : undefined,
  })) as Product[];
}

export async function getRelatedProducts(currentProduct: Product, limit: number = 4): Promise<Product[]> {
  if (!currentProduct.categoryId) return [];
  const productsFromDb = await prisma.product.findMany({
    where: {
      categoryId: currentProduct.categoryId,
      id: { not: currentProduct.id },
    },
    take: limit,
    include: { category: true },
  });
  return mapPrismaDatesAndIdArray(productsFromDb).map(p => ({
    ...p,
    category: p.category ? mapPrismaDatesAndId(p.category as any) as Category : undefined,
  })) as Product[];
}

// --- Category Functions ---
export async function getCategories(): Promise<Category[]> {
  const categoriesFromDb = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
  return mapPrismaDatesAndIdArray(categoriesFromDb) as Category[];
}

export async function getCategoryDetails(idOrName: string): Promise<Category | null> {
 try {
    const categoryFromDb = await prisma.category.findFirst({
      where: {
        OR: [
          { id: idOrName },
          { name: idOrName },
        ],
      },
    });
    return mapPrismaDatesAndId(categoryFromDb) as Category | null;
 } catch (error) {
    console.error(`Error fetching category by ID/Name ${idOrName}:`, error);
    return null;
 }
}

export async function getProductsByCategory(categoryName: string): Promise<Product[]> {
  const category = await prisma.category.findUnique({ where: { name: categoryName } });
  if (!category) return [];

  const productsFromDb = await prisma.product.findMany({
    where: { categoryId: category.id },
    include: { category: true },
  });
  return mapPrismaDatesAndIdArray(productsFromDb).map(p => ({
    ...p,
    category: p.category ? mapPrismaDatesAndId(p.category as any) as Category : undefined,
  })) as Product[];
}

// --- Review Functions ---
export async function getReviewsByProductId(productId: string): Promise<ReviewType[]> {
  const reviewsFromDb = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
    // include: { user: { select: { name: true, id: true } } }, // Optionally include user details
  });
  return mapPrismaDatesAndIdArray(reviewsFromDb) as ReviewType[];
}

// --- Order Functions ---
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const orderFromDb = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          // No need to include product here for OrderItem on Order detail page,
          // as we store nameAtPurchase, etc.
          // If we wanted current product details: include: { product: true }
        },
        // user: { select: { id: true, name: true, email: true } } // Optionally include user details
      },
    });
    if (!orderFromDb) return null;
    
    // Map the main order and its items
    const mappedOrder = mapPrismaDatesAndId(orderFromDb);
    if (mappedOrder) {
      // Prisma's AddressEmbed does not have an id or date fields, so direct assignment is fine
      // Type assertion is needed because PrismaOrder.shippingAddress is AddressEmbed, our Order.shippingAddress expects EmbeddedAddress type
      (mappedOrder as Order).shippingAddress = orderFromDb.shippingAddress as unknown as Order['shippingAddress'];
      (mappedOrder as Order).items = mapPrismaDatesAndIdArray(orderFromDb.items) as OrderItem[];
    }
    return mappedOrder as Order | null;

  } catch (error) {
    console.error(`Error fetching order by ID ${orderId}:`, error);
    return null;
  }
}

// --- Smart Cart Suggestions ---
export async function getSmartCartSuggestions(cartItems: { productId: string, quantity: number }[]): Promise<Product[]> {
  if (cartItems.length === 0) {
    return [];
  }

  const cartProductIds = cartItems.map(item => item.productId);

  const productsInCart = await prisma.product.findMany({
    where: { id: { in: cartProductIds } },
    select: { categoryId: true, petType: true }
  });

  const suggestedProducts: PrismaProduct[] = [];

  const hasDogFood = productsInCart.some(async p => {
    const category = await prisma.category.findUnique({where: {id: p.categoryId}});
    return category?.name === 'Dog Food' && p.petType.includes('dog');
  });

  if (await Promise.all(productsInCart.map(async p => { // Check if any item is dog food
    const category = await prisma.category.findUnique({ where: { id: p.categoryId } });
    return category?.name === 'Dog Food' && p.petType.includes('dog');
  })).then(results => results.some(r => r))) {
    const dogToy = await prisma.product.findFirst({
      where: {
        category: { name: 'Dog Toys' },
        petType: { has: 'dog' },
        id: { notIn: cartProductIds }
      }
    });
    if (dogToy) suggestedProducts.push(dogToy);
  }

  const hasAnyFood = await Promise.all(productsInCart.map(async p => {
    const category = await prisma.category.findUnique({ where: { id: p.categoryId } });
    return category?.name.includes('Food');
  })).then(results => results.some(r => r));

  if (hasAnyFood && suggestedProducts.length < 2) {
    const petTypesInCart = new Set(productsInCart.flatMap(p => p.petType as PetType[]));
    const treat = await prisma.product.findFirst({
      where: {
        category: { name: { contains: 'Treats', mode: 'insensitive' } },
        petType: { hasSome: Array.from(petTypesInCart) },
        id: { notIn: cartProductIds }
      }
    });
    if (treat) suggestedProducts.push(treat);
  }

  if (suggestedProducts.length < 2) {
    const popular = await prisma.product.findMany({
      where: { id: { notIn: cartProductIds.concat(suggestedProducts.map(p => p.id)) } },
      orderBy: { rating: 'desc' },
      take: 2 - suggestedProducts.length
    });
    suggestedProducts.push(...popular);
  }

  return mapPrismaDatesAndIdArray(suggestedProducts.slice(0, 2)) as Product[];
}

// --- User Address Management (New additions) ---
export async function getUserAddresses(userId: string): Promise<import('./types').Address[]> {
  const addressesFromDb = await prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' }, // Show default first
  });
  return mapPrismaDatesAndIdArray(addressesFromDb) as import('./types').Address[];
}

export async function addAddress(userId: string, addressData: Omit<import('./types').Address, 'id' | 'userId'>): Promise<import('./types').Address | null> {
  try {
    // If setting new address as default, unset other defaults for this user
    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }
    const newAddress = await prisma.address.create({
      data: {
        ...addressData,
        userId,
      },
    });
    return mapPrismaDatesAndId(newAddress) as import('./types').Address;
  } catch (error) {
    console.error("Error adding address:", error);
    return null;
  }
}

export async function updateAddress(addressId: string, addressData: Partial<Omit<import('./types').Address, 'id' | 'userId'>>): Promise<import('./types').Address | null> {
  try {
    const existingAddress = await prisma.address.findUnique({ where: {id: addressId}});
    if(!existingAddress) return null;

    // If setting new address as default, unset other defaults for this user
    if (addressData.isDefault && !existingAddress.isDefault) {
      await prisma.address.updateMany({
        where: { userId: existingAddress.userId, isDefault: true, id: {not: addressId} },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: addressData,
    });
    return mapPrismaDatesAndId(updatedAddress) as import('./types').Address;
  } catch (error) {
    console.error("Error updating address:", error);
    return null;
  }
}

export async function deleteAddress(addressId: string): Promise<boolean> {
  try {
    await prisma.address.delete({ where: { id: addressId } });
    return true;
  } catch (error) {
    console.error("Error deleting address:", error);
    return false;
  }
}

export async function setDefaultAddress(userId: string, addressId: string): Promise<boolean> {
   try {
    await prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
      await tx.address.update({
        where: { id: addressId, userId }, // Ensure user owns the address
        data: { isDefault: true },
      });
    });
    return true;
  } catch (error)
   {
    console.error("Error setting default address:", error);
    return false;
  }
}

