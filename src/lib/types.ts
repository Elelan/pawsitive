import type { ObjectId as MongoObjectId } from 'mongodb'; // Keep for existing data-service
import type { User as PrismaUser, Role as PrismaRole } from '@prisma/client';

// MongoDB ObjectId (used by direct driver in data-service.ts)
export type { MongoObjectId };

// Prisma generated types (to be used with new Prisma-based services)
export type { PrismaUser, PrismaRole };


export interface Product {
  _id?: MongoObjectId; // MongoDB primary key for direct driver
  id: string; // String version of _id, used in frontend. For Prisma, this will be from PrismaUser.id
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string; 
  categoryId?: string; 
  petType: PetType[];
  rating: number;
  reviewsCount: number;
  stock: number;
  brand?: string;
  features?: string[];
  variants?: ProductVariant[];
  dataAiHint?: string;
}

export interface ProductVariant {
  id: string; 
  name: string; 
  value: string; 
  priceModifier?: number; 
  stock?: number;
  imageUrl?: string;
}

export type PetType = 'dog' | 'cat' | 'bird' | 'fish' | 'small_animal' | 'reptile';

export interface Category {
  _id?: MongoObjectId; 
  id: string; 
  name: string;
  imageUrl?: string;
  description?: string;
  dataAiHint?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  product: Product; 
  productId: string;
  quantity: number;
  variantId?: string; 
}

export interface Order {
  _id?: MongoObjectId;
  id: string;
  userId: string; 
  items: OrderItem[]; 
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string; 
  createdAt: string; 
  updatedAt?: string; 
  trackingNumber?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  priceAtPurchase: number; 
  nameAtPurchase: string; 
  imageUrlAtPurchase?: string; 
}


export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  fullName?: string;
  phoneNumber?: string;
}

// This AuthUser is for the useAuth hook context
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: PrismaRole; // Using Prisma's Role enum
}
