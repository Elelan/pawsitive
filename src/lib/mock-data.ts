import type { Product, Category, Review, CartItem, Order } from './types';

export const mockCategories: Category[] = [
  { id: 'cat-food', name: 'Dog Food', imageUrl: 'https://placehold.co/300x200.png', description: 'Nutritious food for your canine companion.', dataAiHint: "dog food" },
  { id: 'cat-treats', name: 'Dog Treats', imageUrl: 'https://placehold.co/300x200.png', description: 'Delicious treats for rewarding your dog.', dataAiHint: "dog treats" },
  { id: 'cat-toys', name: 'Dog Toys', imageUrl: 'https://placehold.co/300x200.png', description: 'Fun and engaging toys for dogs.', dataAiHint: "dog toys" },
  { id: 'cat-beds', name: 'Dog Beds', imageUrl: 'https://placehold.co/300x200.png', description: 'Comfortable beds for restful sleep.', dataAiHint: "dog bed" },
  { id: 'cat-grooming', name: 'Dog Grooming', imageUrl: 'https://placehold.co/300x200.png', description: 'Keep your dog clean and healthy.', dataAiHint: "dog grooming" },
  { id: 'cat-cat-food', name: 'Cat Food', imageUrl: 'https://placehold.co/300x200.png', description: 'High-quality food for your feline friend.', dataAiHint: "cat food" },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Dog Kibble - Chicken & Rice',
    description: 'High-quality dry food for adult dogs, made with real chicken and wholesome rice. Provides complete and balanced nutrition.',
    price: 29.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Dog Food',
    petType: ['dog'],
    rating: 4.5,
    reviewsCount: 120,
    stock: 50,
    brand: 'Pawsitive Nutrition',
    features: ['Real chicken as first ingredient', 'No artificial colors or flavors', 'Supports healthy digestion'],
    dataAiHint: "dog kibble"
  },
  {
    id: '2',
    name: 'Organic Salmon Cat Pâté',
    description: 'Grain-free wet cat food made with organic salmon. Rich in omega fatty acids for a healthy coat.',
    price: 1.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Cat Food',
    petType: ['cat'],
    rating: 4.8,
    reviewsCount: 85,
    stock: 100,
    brand: 'Feline Finest',
    features: ['Grain-free', 'Organic salmon', 'Rich in Omega-3 & Omega-6'],
    dataAiHint: "cat pate"
  },
  {
    id: '3',
    name: 'Interactive Puzzle Feeder Toy for Dogs',
    description: 'Engaging toy that dispenses treats as your dog plays. Helps with mental stimulation and slow feeding.',
    price: 15.50,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Dog Toys',
    petType: ['dog'],
    rating: 4.2,
    reviewsCount: 60,
    stock: 30,
    brand: 'Playful Pup',
    features: ['Durable plastic', 'Adjustable difficulty', 'Dishwasher safe'],
    dataAiHint: "dog puzzle"
  },
  {
    id: '4',
    name: 'Cozy Orthopedic Dog Bed - Large',
    description: 'Memory foam dog bed providing excellent support for joints and muscles. Removable, washable cover.',
    price: 59.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Dog Beds',
    petType: ['dog'],
    rating: 4.9,
    reviewsCount: 210,
    stock: 20,
    brand: 'Comfy Paws',
    features: ['Orthopedic memory foam', 'Water-resistant liner', 'Non-slip bottom'],
    dataAiHint: "dog bed large"
  },
  {
    id: '5',
    name: 'Feather Wand Cat Toy',
    description: 'Classic feather wand to entice your cat to jump and play. Promotes exercise and bonding.',
    price: 7.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Cat Toys',
    petType: ['cat'],
    rating: 4.6,
    reviewsCount: 150,
    stock: 75,
    brand: 'Active Kitty',
    features: ['Natural feathers', 'Flexible wand', 'Comfortable grip'],
    dataAiHint: "cat toy feather"
  },
  {
    id: '6',
    name: 'Bird Seed Mix - Wild Birds',
    description: 'A premium blend of seeds to attract a variety of wild birds to your garden.',
    price: 12.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Bird Food',
    petType: ['bird'],
    rating: 4.3,
    reviewsCount: 95,
    stock: 40,
    brand: 'Aviary Delights',
    features: ['Attracts various bird species', 'High-energy mix', 'No fillers'],
    dataAiHint: "bird seed"
  },
  {
    id: '7',
    name: 'Small Animal Hay - Timothy Hay',
    description: 'High-fiber Timothy hay for rabbits, guinea pigs, and chinchillas. Essential for digestive health.',
    price: 9.75,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Small Animal Food',
    petType: ['small_animal'],
    rating: 4.7,
    reviewsCount: 110,
    stock: 60,
    brand: 'Critter Comforts',
    features: ['100% natural Timothy hay', 'Supports dental health', 'Dust-extracted'],
    dataAiHint: "timothy hay"
  },
  {
    id: '8',
    name: 'Aquarium Gravel - Natural River Stones',
    description: 'Natural river stones for a beautiful and healthy aquarium substrate. Safe for all fish.',
    price: 19.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Fish Supplies',
    petType: ['fish'],
    rating: 4.4,
    reviewsCount: 70,
    stock: 35,
    brand: 'AquaScape',
    features: ['Natural look', 'Easy to clean', 'Promotes beneficial bacteria growth'],
    dataAiHint: "aquarium gravel"
  },
];

export const mockReviews: Review[] = [
  { id: 'r1', productId: '1', userId: 'u1', userName: 'Happy Dog Owner', rating: 5, comment: 'My dog loves this food! His coat is so shiny now.', createdAt: '2023-10-01' },
  { id: 'r2', productId: '1', userId: 'u2', userName: 'John D.', rating: 4, comment: 'Good quality food, a bit pricey but worth it.', createdAt: '2023-09-25' },
  { id: 'r3', productId: '2', userId: 'u3', userName: 'CatLover22', rating: 5, comment: 'My picky cat actually eats this! Amazing!', createdAt: '2023-10-05' },
];

// Mock initial cart items
export const initialCartItems: CartItem[] = [
  { product: mockProducts[0], quantity: 1 },
  { product: mockProducts[2], quantity: 2 },
];


// Mock function for AI Smart Cart suggestions
export const getSmartCartSuggestions = async (cartItems: CartItem[]): Promise<Product[]> => {
  // In a real app, this would call an AI service.
  // For now, it suggests some random products or products from related categories.
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

  if (cartItems.length === 0) {
    return [];
  }

  const relatedProducts: Product[] = [];
  const cartCategories = new Set(cartItems.map(item => item.product.category));
  const cartPetTypes = new Set(cartItems.flatMap(item => item.product.petType));

  // Suggest a toy if food is in cart for the same pet type
  if (cartCategories.has('Dog Food') && cartPetTypes.has('dog')) {
    const toy = mockProducts.find(p => p.category === 'Dog Toys' && p.petType.includes('dog') && !cartItems.find(ci => ci.product.id === p.id));
    if (toy) relatedProducts.push(toy);
  }
  if (cartCategories.has('Cat Food') && cartPetTypes.has('cat')) {
    const toy = mockProducts.find(p => p.category === 'Cat Toys' && p.petType.includes('cat') && !cartItems.find(ci => ci.product.id === p.id));
    if (toy) relatedProducts.push(toy);
  }

  // Suggest treats if any food is in cart
  if (cartItems.some(item => item.product.category.includes('Food'))) {
     const treat = mockProducts.find(p => p.category.includes('Treats') && p.petType.some(pt => cartPetTypes.has(pt)) && !cartItems.find(ci => ci.product.id === p.id));
     if (treat) relatedProducts.push(treat);
  }
  
  // Add some general popular items if not enough suggestions
  if (relatedProducts.length < 2) {
    mockProducts.slice(0, 3).forEach(p => {
      if (relatedProducts.length < 2 && !cartItems.find(ci => ci.product.id === p.id) && !relatedProducts.find(rp => rp.id === p.id)) {
        relatedProducts.push(p);
      }
    });
  }

  return relatedProducts.slice(0,2); // Max 2 suggestions
};

export const mockOrders: Order[] = [
    {
        id: 'order123',
        userId: 'user1',
        items: [
            { product: mockProducts[0], quantity: 1 },
            { product: mockProducts[2], quantity: 2 },
        ],
        totalAmount: mockProducts[0].price + (mockProducts[2].price * 2),
        status: 'delivered',
        shippingAddress: { street: '123 Main St', city: 'Anytown', state: 'CA', zipCode: '90210', country: 'USA' },
        paymentMethod: 'Credit Card',
        createdAt: '2023-10-15T10:00:00Z',
        trackingNumber: '1Z999AA10123456784',
    },
    {
        id: 'order456',
        userId: 'user1',
        items: [
            { product: mockProducts[1], quantity: 3 },
        ],
        totalAmount: mockProducts[1].price * 3,
        status: 'shipped',
        shippingAddress: { street: '123 Main St', city: 'Anytown', state: 'CA', zipCode: '90210', country: 'USA' },
        paymentMethod: 'PayPal',
        createdAt: '2023-11-01T14:30:00Z',
        trackingNumber: '1Z999AA10123456785',
    }
];
