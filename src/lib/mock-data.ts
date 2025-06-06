
// src/lib/mock-data.ts
import type { Review, Order, CartItem as CartItemType } from './types';
// All product and category mock data is removed as it will now come from Prisma.
// Review and Order mocks are kept for now, but data-service will use Prisma for them.

export const mockReviews: Review[] = [
  // These IDs should ideally match product IDs from your seeded Prisma database
  // For now, they are placeholders.
  { id: 'r1', productId: 'some_prisma_product_id_1', userId: 'some_prisma_user_id_1', userName: 'Happy Dog Owner', rating: 5, comment: 'My dog loves this food! His coat is so shiny now.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'r2', productId: 'some_prisma_product_id_1', userId: 'some_prisma_user_id_2', userName: 'John D.', rating: 4, comment: 'Good quality food, a bit pricey but worth it.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'r3', productId: 'some_prisma_product_id_2', userId: 'some_prisma_user_id_3', userName: 'CatLover22', rating: 5, comment: 'My picky cat actually eats this! Amazing!', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const initialCartItems: CartItemType[] = [];

export const mockOrders: Order[] = [
    {
        id: 'mock_order_123',
        userId: 'some_prisma_user_id_1',
        items: [
            { 
              id: 'oi1', 
              orderId: 'mock_order_123',
              productId: 'some_prisma_product_id_1', // Replace with actual Product ID from Prisma
              quantity: 1, 
              priceAtPurchase: 29.99, 
              nameAtPurchase: 'Premium Dog Kibble - Chicken & Rice', 
              imageUrlAtPurchase: 'https://placehold.co/600x400.png' 
            },
            { 
              id: 'oi2',
              orderId: 'mock_order_123',
              productId: 'some_prisma_product_id_3', // Replace with actual Product ID from Prisma
              quantity: 2, 
              priceAtPurchase: 15.50, 
              nameAtPurchase: 'Interactive Puzzle Feeder Toy for Dogs', 
              imageUrlAtPurchase: 'https://placehold.co/600x400.png'
            },
        ],
        totalAmount: 29.99 + (15.50 * 2),
        status: 'DELIVERED', // Use string status consistent with Prisma schema
        shippingAddress: { street: '123 Main St', city: 'Anytown', state: 'CA', zipCode: '90210', country: 'USA', fullName: 'Happy PetOwner' },
        paymentMethod: 'Credit Card',
        createdAt: '2023-10-15T10:00:00Z',
        updatedAt: '2023-10-15T10:00:00Z',
        trackingNumber: '1Z999AA10123456784',
    },
];
// Note: getSmartCartSuggestions and other data fetching logic is now in data-service.ts using Prisma.
