
import type { User as PrismaUser, Role as PrismaRole, Product as PrismaProduct, Category as PrismaCategory, Review as PrismaReview, Order as PrismaOrder, OrderItem as PrismaOrderItem, Address as PrismaAddress } from '@prisma/client';

export type { PrismaUser, PrismaRole };

// Re-exporting Prisma types where they largely match our needs, or defining interfaces that extend/omit Prisma types.

export interface Product extends Omit<PrismaProduct, 'createdAt' | 'updatedAt' | 'category' | 'reviews' | 'orderItems'> {
  // Prisma's 'id' is string. 'categoryId' is also string.
  // Optional 'category' for eager loading if needed by components.
  category?: Category;
  reviews?: Review[];
  orderItems?: OrderItem[];
  createdAt: string; // Serialized to ISO string by API
  updatedAt: string; // Serialized to ISO string by API
  variants?: ProductVariant[]; // Kept if variants are more complex and not directly on PrismaProduct
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceModifier?: number;
  stock?: number;
  imageUrl?: string;
}

export type PetType = 'dog' | 'cat' | 'bird' | 'fish' | 'small_animal' | 'reptile'; // This is fine as an app-level enum/type

export interface Category extends Omit<PrismaCategory, 'createdAt' | 'updatedAt' | 'products'> {
  products?: Product[]; // Optional for eager loading
  createdAt: string;
  updatedAt: string;
}

export interface Review extends Omit<PrismaReview, 'createdAt' | 'updatedAt' | 'product' | 'user'> {
  // Prisma's 'productId' and 'userId' are strings.
  product?: Product; // Optional for eager loading
  user?: User;       // Optional for eager loading
  createdAt: string;
  updatedAt: string;
}

// This is for the user-manageable addresses.
// PrismaAddress includes id, createdAt, updatedAt, userId.
export interface Address extends Omit<PrismaAddress, 'userId'> {
  // id will be present if fetched, optional if new
  id?: string;
  userId?: string; // Optional because it's part of the relation, not always needed in DTO
}


// For Order.shippingAddress, which is an embedded type in Prisma schema (AddressEmbed)
// We'll map it to the Address interface for consistency on the client,
// but it won't have an 'id' or 'userId' from the DB in this embedded context.
export interface EmbeddedAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  fullName?: string;
  phoneNumber?: string;
}


export interface Order extends Omit<PrismaOrder, 'createdAt' | 'updatedAt' | 'user' | 'items' | 'shippingAddress' | 'userId'> {
  // Prisma's 'userId' is string.
  userId: string;
  items: OrderItem[];
  shippingAddress: EmbeddedAddress; // Matches the embedded type structure
  user?: User; // Optional for eager loading
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem extends Omit<PrismaOrderItem, 'order' | 'product' | 'orderId' | 'productId'> {
  // Prisma's 'orderId' and 'productId' are strings.
  orderId: string;
  productId: string;
  product?: Product; // Optional for eager loading
}

// User type for general use, extending PrismaUser
export interface User extends Omit<PrismaUser, 'createdAt' | 'updatedAt' | 'password' | 'reviews' | 'orders' | 'addresses'> {
  // Exclude password for security.
  // Relations like reviews, orders, addresses can be added if needed for specific views.
  createdAt: string;
  updatedAt: string;
}


// AuthUser for the useAuth hook context (already aligned with Prisma)
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: PrismaRole;
}

// CartItem remains a client-side type
export interface CartItem {
  product: Product; // This product object will come from Prisma-backed data service
  productId: string;
  quantity: number;
  variantId?: string;
}
