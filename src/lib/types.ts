import type { ObjectId } from 'mongodb';

export interface Product {
  _id?: ObjectId; // MongoDB primary key
  id: string; // String version of _id, used in frontend
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string; // Should ideally be categoryId (string) linking to Categories collection
  categoryId?: string; // Store category ID for better relational data
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
  id: string; // Could be a simple identifier or unique within product
  name: string; // e.g. "Size", "Color"
  value: string; // e.g. "Large", "Red"
  priceModifier?: number; // +5 or -2 from base price
  stock?: number;
  imageUrl?: string;
}

export type PetType = 'dog' | 'cat' | 'bird' | 'fish' | 'small_animal' | 'reptile';

export interface Category {
  _id?: ObjectId; // MongoDB primary key
  id: string; // String version of _id, used in frontend
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
  product: Product; // For display, but could be just productId for storage
  productId: string;
  quantity: number;
  variantId?: string; // If product has variants
}

export interface Order {
  _id?: ObjectId;
  id: string;
  userId: string; // ID of the user who placed the order
  items: OrderItem[]; // Changed from CartItem[] to OrderItem[]
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string; // e.g. "Credit Card", "PayPal"
  createdAt: string; // ISO Date string
  updatedAt?: string; // ISO Date string
  trackingNumber?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  priceAtPurchase: number; // Price of the product when the order was placed
  nameAtPurchase: string; // Name of product when order was placed
  imageUrlAtPurchase?: string; // Image URL when order was placed
  // You might want to store a snapshot of product details at time of purchase
  // or fetch current product details for display, handling cases where product might change/be deleted.
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

export interface UserProfile {
  _id?: ObjectId;
  id: string;
  email: string;
  name: string;
  shippingAddresses: Address[];
  orderHistoryIds?: string[]; // Store Order IDs
}
