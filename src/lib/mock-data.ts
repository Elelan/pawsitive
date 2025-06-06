import type { Review, Order, CartItem as CartItemType, OrderItem, Product } from './types';
// Most mock data (products, categories) is removed as it will come from MongoDB.
// We keep mockReviews and an updated mockOrders structure.
// initialCartItems will be empty.

export const mockReviews: Review[] = [
  { id: 'r1', productId: 'product_id_from_db_1', userId: 'u1', userName: 'Happy Dog Owner', rating: 5, comment: 'My dog loves this food! His coat is so shiny now.', createdAt: '2023-10-01' },
  { id: 'r2', productId: 'product_id_from_db_1', userId: 'u2', userName: 'John D.', rating: 4, comment: 'Good quality food, a bit pricey but worth it.', createdAt: '2023-09-25' },
  { id: 'r3', productId: 'product_id_from_db_2', userId: 'u3', userName: 'CatLover22', rating: 5, comment: 'My picky cat actually eats this! Amazing!', createdAt: '2023-10-05' },
];

// Initial cart items will now be empty. User adds items manually.
export const initialCartItems: CartItemType[] = [];

// Updated mockOrders structure to store OrderItems with product IDs
export const mockOrders: Order[] = [
    {
        id: 'order123', // This ID will be used for URL, keep as string
        userId: 'user1', // Mock user ID
        items: [
            // Replace with actual Product IDs from your MongoDB and details at time of purchase
            { productId: 'REPLACE_WITH_PRODUCT_ID_1', quantity: 1, priceAtPurchase: 29.99, nameAtPurchase: 'Premium Dog Kibble - Chicken & Rice', imageUrlAtPurchase: 'https://placehold.co/600x400.png' },
            { productId: 'REPLACE_WITH_PRODUCT_ID_3', quantity: 2, priceAtPurchase: 15.50, nameAtPurchase: 'Interactive Puzzle Feeder Toy for Dogs', imageUrlAtPurchase: 'https://placehold.co/600x400.png' },
        ],
        totalAmount: 29.99 + (15.50 * 2), // Calculate based on priceAtPurchase
        status: 'delivered',
        shippingAddress: { street: '123 Main St', city: 'Anytown', state: 'CA', zipCode: '90210', country: 'USA', fullName: 'Happy PetOwner' },
        paymentMethod: 'Credit Card',
        createdAt: '2023-10-15T10:00:00Z',
        trackingNumber: '1Z999AA10123456784',
    },
    {
        id: 'order456',
        userId: 'user1',
        items: [
            { productId: 'REPLACE_WITH_PRODUCT_ID_2', quantity: 3, priceAtPurchase: 1.99, nameAtPurchase: 'Organic Salmon Cat Pâté', imageUrlAtPurchase: 'https://placehold.co/600x400.png' },
        ],
        totalAmount: 1.99 * 3,
        status: 'shipped',
        shippingAddress: { street: '456 Playful Path', city: 'Joytown', state: 'NY', zipCode: '67890', country: 'USA', fullName: 'Work Address' },
        paymentMethod: 'PayPal',
        createdAt: '2023-11-01T14:30:00Z',
        trackingNumber: '1Z999AA10123456785',
    }
];

// Note: getSmartCartSuggestions is moved to data-service.ts and will use DB.
