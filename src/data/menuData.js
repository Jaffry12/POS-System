// 3 Sisters Vietnamese Subs - Complete Menu Data

export const DEFAULT_MENU = {
  subs: [
    { id: 'sub-1', name: 'Sirloin Sate Beef', image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400', price: 990, category: 'subs', hasModifiers: true },
    { id: 'sub-2', name: 'Marinated Pork Chop', image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400', price: 990, category: 'subs', hasModifiers: true },
    { id: 'sub-3', name: 'Grilled Lemongrass Chicken', image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=400', price: 990, category: 'subs', hasModifiers: true },
    { id: 'sub-4', name: 'Lemongrass Tofu', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', price: 990, category: 'subs', hasModifiers: true },
    { id: 'sub-5', name: 'Grilled Pork Sausage', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', price: 990, category: 'subs', hasModifiers: true },
    { id: 'sub-6', name: 'Assorted (Turkey, Ham, Pork)', image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400', price: 990, category: 'subs', hasModifiers: true },
    // ✅ PLATTER moved from its own category to SUBS
    { id: 'platter-1', name: 'Platter', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', price: 13093, category: 'subs', hasModifiers: false },
  ],
  coffee: [
    { id: 'coffee-1', name: 'Vietnamese Iced Coffee', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', price: 500, category: 'coffee', hasModifiers: false },
  ],
  fruittea: [
    { id: 'ft-1', name: 'Strawberry Fruit Tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'fruittea', hasModifiers: true },
    { id: 'ft-2', name: 'Mango Fruit Tea', image: 'https://images.unsplash.com/photo-1624484537985-e8ea6912e812?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'fruittea', hasModifiers: true },
    { id: 'ft-3', name: 'Peach Fruit Tea', image: 'https://images.unsplash.com/photo-1627308595186-7d6c057df01f?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'fruittea', hasModifiers: true },
    { id: 'ft-4', name: 'Passion Fruit Tea', image: 'https://images.unsplash.com/photo-1622597468795-c2a46d1a8cd1?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'fruittea', hasModifiers: true },
    { id: 'ft-5', name: 'Guava Fruit Tea', image: 'https://images.unsplash.com/photo-1622597467836-f3c23223e1c8?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'fruittea', hasModifiers: true },
    { id: 'ft-6', name: 'Blueberry Fruit Tea', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'fruittea', hasModifiers: true },
    { id: 'ft-7', name: 'Pineapple Fruit Tea', image: 'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'fruittea', hasModifiers: true },
    { id: 'ft-8', name: 'Lychee Fruit Tea', image: 'https://images.unsplash.com/photo-1632334991031-da9ebc9ce66d?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'fruittea', hasModifiers: true },
    { id: 'ft-9', name: 'Kiwi Fruit Tea', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'fruittea', hasModifiers: true },
    { id: 'ft-10', name: 'Green Apple Fruit Tea', image: 'https://images.unsplash.com/photo-1576179635662-9d1983e97e1e?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'fruittea', hasModifiers: true },
    { id: 'ft-11', name: 'Grape Fruit Tea', image: 'https://images.unsplash.com/photo-1599819177841-6bc6e61b4e97?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'fruittea', hasModifiers: true },
  ],
  milktea: [
    { id: 'mt-1', name: 'Regular Milk Tea', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'milktea', hasModifiers: true },
    { id: 'mt-2', name: 'Premium Brown Sugar Milk Tea', image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'milktea', hasModifiers: true },
    { id: 'mt-3', name: 'Hazelnut Milk Tea', image: 'https://images.unsplash.com/photo-1577968897068-2a7b8b4f9d7d?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'milktea', hasModifiers: true },
    { id: 'mt-4', name: 'Taro Milk Tea', image: 'https://images.unsplash.com/photo-1577968897068-2a7b8b4f9d7d?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'milktea', hasModifiers: true },
    { id: 'mt-5', name: 'Honeydew Milk Tea', image: 'https://images.unsplash.com/photo-1622597467836-f3c23223e1c8?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'milktea', hasModifiers: true },
    { id: 'mt-6', name: 'Chocolate Milk Tea', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'milktea', hasModifiers: true },
    { id: 'mt-7', name: 'Matcha Green Milk Tea', image: 'https://images.unsplash.com/photo-1545875615-a67a271f0603?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'milktea', hasModifiers: true },
    { id: 'mt-8', name: 'Coconut Milk Tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'milktea', hasModifiers: true },
    { id: 'mt-9', name: 'Hokkaido Milk Tea', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'milktea', hasModifiers: true },
    { id: 'mt-10', name: 'Okinawa Milk Tea', image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'milktea', hasModifiers: true },
    { id: 'mt-11', name: 'Mango Milk Tea', image: 'https://images.unsplash.com/photo-1624484537985-e8ea6912e812?w=400', prices: { '500ml': 500, '700ml': 600 }, category: 'milktea', hasModifiers: true },
  ],
  // ✅ HOTS: Fixed price, NO size selection, "Hot" prefix REMOVED from names
  hots: [
    { id: 'hot-1', name: 'Regular Milk Tea', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', price: 500, category: 'hots', hasModifiers: false },
    { id: 'hot-2', name: 'Premium Brown Sugar Milk Tea', image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400', price: 500, category: 'hots', hasModifiers: false },
    { id: 'hot-3', name: 'Hazelnut Milk Tea', image: 'https://images.unsplash.com/photo-1577968897068-2a7b8b4f9d7d?w=400', price: 500, category: 'hots', hasModifiers: false },
    { id: 'hot-4', name: 'Taro Milk Tea', image: 'https://images.unsplash.com/photo-1577968897068-2a7b8b4f9d7d?w=400', price: 500, category: 'hots', hasModifiers: false },
    { id: 'hot-5', name: 'Honeydew Milk Tea', image: 'https://images.unsplash.com/photo-1622597467836-f3c23223e1c8?w=400', price: 500, category: 'hots', hasModifiers: false },
    { id: 'hot-6', name: 'Chocolate Milk Tea', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', price: 500, category: 'hots', hasModifiers: false },
    { id: 'hot-7', name: 'Matcha Green Milk Tea', image: 'https://images.unsplash.com/photo-1545875615-a67a271f0603?w=400', price: 500, category: 'hots', hasModifiers: false },
    { id: 'hot-8', name: 'Coconut Milk Tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', price: 500, category: 'hots', hasModifiers: false },
    { id: 'hot-9', name: 'Hokkaido Milk Tea', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', price: 500, category: 'hots', hasModifiers: false },
    { id: 'hot-10', name: 'Okinawa Milk Tea', image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400', price: 500, category: 'hots', hasModifiers: false },
    { id: 'hot-11', name: 'Mango Milk Tea', image: 'https://images.unsplash.com/photo-1624484537985-e8ea6912e812?w=400', price: 500, category: 'hots', hasModifiers: false },
  ],
};

// Category structure with main categories and subcategories
export const CATEGORIES = {
  // Main categories - SUBS and DRINKS
  main: [
    { id: 'subs', name: 'SUBS', icon: 'Sandwich', color: '#4F46E5' },
    { id: 'drinks', name: 'DRINKS', icon: 'Coffee', color: '#10B981', hasSubcategories: true },
    { id: 'hots', name: 'HOTS', icon: 'Flame', color: '#F97316' },
  ],
  
  // Drink subcategories - shown when DRINKS is selected
  drinks: [
    { id: 'coffee', name: 'Vietnamese Iced Coffee', parent: 'drinks' },
    { id: 'fruittea', name: 'FRUIT TEA', parent: 'drinks' },
    { id: 'milktea', name: 'MILK TEA', parent: 'drinks' },
  ],
};

// Modifiers for sandwiches (Sub Toppings + Extras)
export const SUB_MODIFIERS = {
  subToppings: {
    groupId: 'sub-toppings',
    groupTitle: 'Sub Toppings',
    multiSelect: false, // Only one can be selected
    options: [
      { id: 'all-toppings', name: 'All Toppings', price: 0 },
      { id: 'no-cucumber', name: 'No Cucumber', price: 0 },
      { id: 'no-mayo', name: 'No Mayo', price: 0 },
      { id: 'no-pickled', name: 'No Pickled Carrots', price: 0 },
      { id: 'no-cilantro', name: 'No Cilantro', price: 0 },
      { id: 'no-jalapenos', name: 'No Jalapeños', price: 0 },
      { id: 'no-onions', name: 'No Onions', price: 0 },
    ],
  },
  extras: {
    groupId: 'extras',
    groupTitle: 'Extras',
    multiSelect: true, // Multiple can be selected
    options: [
      { id: 'extra-cilantro', name: 'Extra Cilantro', price: 0 },
      { id: 'extra-cucumber', name: 'Extra Cucumber', price: 0 },
      { id: 'extra-garlic-mayo', name: 'Extra Garlic Mayo', price: 50 },
      { id: 'extra-jalapenos', name: 'Extra Jalapeños', price: 0 },
      { id: 'extra-onions', name: 'Extra Onions', price: 0 },
      { id: 'extra-pickled', name: 'Extra Pickled Carrots', price: 50 },
      { id: 'extra-meat', name: 'Extra meat', price: 350 },
      { id: 'no-extras', name: 'No Extras', price: 0 },
    ],
  },
};

// Toppings for drinks (Boba, Jelly, Popping Pearls)
// ✅ FIXED: Changed all topping prices from 98 cents to 100 cents (CA$1.00)
export const DRINK_MODIFIERS = {
  toppings: {
    groupId: 'toppings',
    groupTitle: 'Toppings',
    multiSelect: true, // Multiple can be selected
    options: [
      { id: 'boba', name: 'Boba / Tapioca Pearls', price: 100 },
      { id: 'crystal-boba', name: 'Crystal Boba', price: 100 },
      { id: 'mango-jelly', name: 'Mango Jelly', price: 100 },
      { id: 'lychee-jelly', name: 'Lychee Jelly', price: 100 },
      { id: 'green-apple-jelly', name: 'Green Apple Jelly', price: 100 },
      { id: 'passionfruit-jelly', name: 'Passion Fruit Jelly', price: 100 },
      { id: 'strawberry-jelly', name: 'Strawberry Jelly', price: 100 },
      { id: 'popping-mango', name: 'Popping Mango Pearls', price: 100 },
      { id: 'popping-lychee', name: 'Popping Lychee Pearls', price: 100 },
      { id: 'popping-peach', name: 'Popping Peach Pearls', price: 100 },
      { id: 'popping-blueberry', name: 'Popping Blueberry Pearls', price: 100 },
      { id: 'popping-strawberry', name: 'Popping Strawberry Pearls', price: 100 },
      { id: 'popping-passionfruit', name: 'Popping Passion Fruit Pearls', price: 100 },
      { id: 'no-toppings', name: 'No Toppings', price: 0 },
    ],
  },
};

export const NAVIGATION_ITEMS = [
  { id: 'home', name: 'Home', icon: 'Home', path: '/' },
  { id: 'menu', name: 'Menu', icon: 'MenuSquare', path: '/menu' },
  { id: 'order', name: 'Order', icon: 'ShoppingCart', path: '/orders' },
  { id: 'history', name: 'History', icon: 'Clock', path: '/history' },
  { id: 'bills', name: 'Bills', icon: 'Receipt', path: '/bills' },
  { id: 'setting', name: 'Setting', icon: 'Settings', path: '/settings' },
];

export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash', icon: 'Banknote' },
  { id: 'card', name: 'Card', icon: 'CreditCard' },
  { id: 'gift', name: 'Gift Certificate', icon: 'Gift' },
];

export const SETTINGS = {
  shopName: '3 Sisters Vietnamese Subs',
  shopSubtitle: 'Lotus Main Store',
  currency: 'CA$',
  taxRate: 0.15,
  allowDiscount: true,
  receiptFooter: 'Thank you for your business!',
};