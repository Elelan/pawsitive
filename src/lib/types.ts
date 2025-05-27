export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  petType: PetType[];
  rating: number;
  reviewsCount: number;
  stock: number;
  brand?: string;
  features?: string[];
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size", "Color"
  value: string; // e.g. "Large", "Red"
  priceModifier?: number; // +5 or -2 from base price
  stock?: number;
  imageUrl?: string;
}

export type PetType = 'dog' | 'cat' | 'bird' | 'fish' | 'small_animal' | 'reptile';

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
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
  quantity: number;
  variantId?: string; // If product has variants
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string; // e.g. "Credit Card", "PayPal"
  createdAt: string;
  updatedAt?: string;
  trackingNumber?: string;
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
  id: string;
  email: string;
  name: string;
  shippingAddresses: Address[];
  // paymentMethods: PaymentMethod[]; // Potentially more complex
  orderHistory: Order[];
}
