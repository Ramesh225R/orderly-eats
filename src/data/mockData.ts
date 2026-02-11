export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isVeg: boolean;
  isVegan?: boolean;
  isBestseller?: boolean;
  spiceLevel?: 1 | 2 | 3;
  rating?: number;
  calories?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  logo: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  distance: string;
  isOpen: boolean;
  discount?: string;
  promoted?: boolean;
  menu: MenuItem[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export const categories: Category[] = [
  { id: "1", name: "Pizza", icon: "🍕", count: 120 },
  { id: "2", name: "Burgers", icon: "🍔", count: 95 },
  { id: "3", name: "Sushi", icon: "🍣", count: 64 },
  { id: "4", name: "Indian", icon: "🍛", count: 88 },
  { id: "5", name: "Chinese", icon: "🥡", count: 73 },
  { id: "6", name: "Mexican", icon: "🌮", count: 56 },
  { id: "7", name: "Desserts", icon: "🍰", count: 102 },
  { id: "8", name: "Healthy", icon: "🥗", count: 47 },
  { id: "9", name: "Coffee", icon: "☕", count: 38 },
  { id: "10", name: "Thai", icon: "🍜", count: 41 },
];

const menuItems: Record<string, MenuItem[]> = {
  "1": [
    { id: "m1", name: "Margherita Pizza", description: "Classic tomato sauce, fresh mozzarella, basil leaves", price: 12.99, image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&h=300&fit=crop", category: "Pizza", isVeg: true, isBestseller: true, rating: 4.8, calories: 680 },
    { id: "m2", name: "Pepperoni Feast", description: "Loaded with premium pepperoni, mozzarella, oregano", price: 15.99, originalPrice: 18.99, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop", category: "Pizza", isVeg: false, isBestseller: true, spiceLevel: 1, rating: 4.7, calories: 820 },
    { id: "m3", name: "Caesar Salad", description: "Crisp romaine, parmesan, croutons, creamy dressing", price: 8.99, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop", category: "Salads", isVeg: true, rating: 4.5, calories: 340 },
    { id: "m4", name: "Garlic Bread", description: "Toasted ciabatta with roasted garlic butter and herbs", price: 5.99, image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400&h=300&fit=crop", category: "Sides", isVeg: true, rating: 4.6, calories: 280 },
    { id: "m5", name: "Tiramisu", description: "Layers of mascarpone, espresso-soaked ladyfingers, cocoa", price: 7.99, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop", category: "Desserts", isVeg: true, isBestseller: true, rating: 4.9, calories: 450 },
    { id: "m6", name: "BBQ Chicken Pizza", description: "Smoky BBQ sauce, grilled chicken, red onions, cilantro", price: 16.99, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop", category: "Pizza", isVeg: false, spiceLevel: 2, rating: 4.6, calories: 790 },
  ],
  "2": [
    { id: "m7", name: "Spicy Tuna Roll", description: "Fresh tuna, spicy mayo, cucumber, sesame seeds", price: 14.99, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop", category: "Rolls", isVeg: false, isBestseller: true, spiceLevel: 2, rating: 4.8, calories: 320 },
    { id: "m8", name: "Salmon Nigiri (4pc)", description: "Premium Atlantic salmon over seasoned rice", price: 12.99, image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop", category: "Nigiri", isVeg: false, rating: 4.9, calories: 240 },
    { id: "m9", name: "Edamame", description: "Steamed soybeans with sea salt", price: 5.99, image: "https://images.unsplash.com/photo-1564093497595-593b96d80180?w=400&h=300&fit=crop", category: "Starters", isVeg: true, isVegan: true, rating: 4.4, calories: 180 },
    { id: "m10", name: "Dragon Roll", description: "Eel, avocado, cucumber with special sauce", price: 18.99, image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop", category: "Rolls", isVeg: false, isBestseller: true, rating: 4.7, calories: 380 },
  ],
  "3": [
    { id: "m11", name: "Classic Smash Burger", description: "Double smashed patty, American cheese, pickles, secret sauce", price: 13.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop", category: "Burgers", isVeg: false, isBestseller: true, rating: 4.8, calories: 720 },
    { id: "m12", name: "Truffle Fries", description: "Crispy fries, truffle oil, parmesan, fresh herbs", price: 8.99, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop", category: "Sides", isVeg: true, rating: 4.6, calories: 420 },
    { id: "m13", name: "Veggie Beyond Burger", description: "Beyond Meat patty, avocado, tomato, vegan aioli", price: 14.99, image: "https://images.unsplash.com/photo-1520072959219-c595e6cdc07e?w=400&h=300&fit=crop", category: "Burgers", isVeg: true, isVegan: true, rating: 4.5, calories: 580 },
    { id: "m14", name: "Milkshake", description: "Thick & creamy vanilla bean milkshake", price: 6.99, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop", category: "Drinks", isVeg: true, rating: 4.7, calories: 520 },
  ],
};

// Copy menus for restaurants that share similar items
const defaultMenu = menuItems["1"];

export const restaurants: Restaurant[] = [
  {
    id: "1", name: "La Bella Italia", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop", logo: "🇮🇹",
    cuisine: ["Italian", "Pizza", "Pasta"], rating: 4.7, reviewCount: 1243, deliveryTime: "25-35 min", deliveryFee: 2.99, minOrder: 15, distance: "1.2 km", isOpen: true, discount: "30% OFF", promoted: true, menu: menuItems["1"],
  },
  {
    id: "2", name: "Sakura Sushi Bar", image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=600&h=400&fit=crop", logo: "🇯🇵",
    cuisine: ["Japanese", "Sushi", "Asian"], rating: 4.9, reviewCount: 876, deliveryTime: "30-40 min", deliveryFee: 3.99, minOrder: 20, distance: "2.1 km", isOpen: true, menu: menuItems["2"],
  },
  {
    id: "3", name: "Burger Republic", image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&h=400&fit=crop", logo: "🍔",
    cuisine: ["American", "Burgers", "Fast Food"], rating: 4.5, reviewCount: 2156, deliveryTime: "15-25 min", deliveryFee: 1.99, minOrder: 10, distance: "0.8 km", isOpen: true, discount: "Free Delivery", menu: menuItems["3"],
  },
  {
    id: "4", name: "Spice Garden", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop", logo: "🇮🇳",
    cuisine: ["Indian", "Curry", "Biryani"], rating: 4.6, reviewCount: 654, deliveryTime: "35-45 min", deliveryFee: 2.49, minOrder: 18, distance: "3.0 km", isOpen: true, discount: "20% OFF", menu: defaultMenu,
  },
  {
    id: "5", name: "Taco Loco", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop", logo: "🇲🇽",
    cuisine: ["Mexican", "Tacos", "Burritos"], rating: 4.4, reviewCount: 432, deliveryTime: "20-30 min", deliveryFee: 1.99, minOrder: 12, distance: "1.5 km", isOpen: true, menu: defaultMenu,
  },
  {
    id: "6", name: "Green Bowl", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop", logo: "🥗",
    cuisine: ["Healthy", "Salads", "Vegan"], rating: 4.8, reviewCount: 321, deliveryTime: "20-30 min", deliveryFee: 2.99, minOrder: 14, distance: "1.8 km", isOpen: true, promoted: true, menu: defaultMenu,
  },
  {
    id: "7", name: "Dragon Wok", image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600&h=400&fit=crop", logo: "🐉",
    cuisine: ["Chinese", "Asian", "Noodles"], rating: 4.3, reviewCount: 567, deliveryTime: "25-35 min", deliveryFee: 2.49, minOrder: 15, distance: "2.5 km", isOpen: false, menu: defaultMenu,
  },
  {
    id: "8", name: "Sweet Dreams Bakery", image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&h=400&fit=crop", logo: "🧁",
    cuisine: ["Desserts", "Bakery", "Coffee"], rating: 4.7, reviewCount: 789, deliveryTime: "15-25 min", deliveryFee: 1.49, minOrder: 8, distance: "0.5 km", isOpen: true, discount: "Buy 2 Get 1", menu: defaultMenu,
  },
];
