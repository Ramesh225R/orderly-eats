import { useParams, Link } from "react-router-dom";
import { restaurants } from "@/data/mockData";
import { useCart } from "@/context/CartContext";
import { Star, Clock, MapPin, ArrowLeft, Plus, Minus, Heart } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const restaurant = restaurants.find(r => r.id === id);
  const { addItem, items, updateQuantity } = useCart();
  const [menuSearch, setMenuSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const menuCategories = useMemo(() => {
    if (!restaurant) return [];
    const cats = [...new Set(restaurant.menu.map(m => m.category))];
    return cats;
  }, [restaurant]);

  const filteredMenu = useMemo(() => {
    if (!restaurant) return [];
    let items = restaurant.menu;
    if (menuSearch) {
      const q = menuSearch.toLowerCase();
      items = items.filter(m => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
    }
    if (activeCategory) items = items.filter(m => m.category === activeCategory);
    return items;
  }, [restaurant, menuSearch, activeCategory]);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl block mb-4">😕</span>
          <p className="text-lg font-display font-semibold">Restaurant not found</p>
          <Link to="/restaurants" className="text-sm text-primary hover:underline mt-2 inline-block">
            Browse all restaurants
          </Link>
        </div>
      </div>
    );
  }

  const getItemQuantity = (itemId: string) => {
    const cartItem = items.find(i => i.id === itemId);
    return cartItem?.quantity || 0;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        <Link
          to="/restaurants"
          className="absolute top-4 left-4 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-background/90 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-background/90 transition-colors">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      <div className="container -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-xl p-6 border border-border/50"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{restaurant.logo}</span>
                <h1 className="text-2xl md:text-3xl font-display font-bold">{restaurant.name}</h1>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{restaurant.cuisine.join(" • ")}</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent/15 text-accent font-semibold">
                  <Star className="w-4 h-4 fill-current" /> {restaurant.rating}
                  <span className="text-muted-foreground font-normal">({restaurant.reviewCount})</span>
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" /> {restaurant.deliveryTime}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" /> {restaurant.distance}
                </span>
              </div>
            </div>
            {restaurant.discount && (
              <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-primary text-primary-foreground">
                {restaurant.discount}
              </span>
            )}
          </div>
        </motion.div>

        {/* Menu */}
        <div className="mt-8 pb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              value={menuSearch}
              onChange={e => setMenuSearch(e.target.value)}
              placeholder="Search menu..."
              className="h-10 px-4 rounded-lg bg-card border border-border text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 sticky top-16 z-20 bg-background/95 backdrop-blur-sm py-2 -mx-1 px-1">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 text-sm font-medium rounded-full border whitespace-nowrap transition-colors ${
                !activeCategory ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              All
            </button>
            {menuCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-full border whitespace-nowrap transition-colors ${
                  activeCategory === cat ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredMenu.map((item, i) => {
              const qty = getItemQuantity(item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex gap-4 p-4 rounded-xl bg-card border border-border/50 card-hover"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-3.5 h-3.5 rounded-sm border-2 ${item.isVeg ? "border-accent" : "border-coral"}`}>
                        <span className={`block w-1.5 h-1.5 rounded-full m-[2px] ${item.isVeg ? "bg-accent" : "bg-coral"}`} />
                      </span>
                      {item.isBestseller && (
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">★ BESTSELLER</span>
                      )}
                      {item.spiceLevel && (
                        <span className="text-xs">{"🌶️".repeat(item.spiceLevel)}</span>
                      )}
                    </div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold">${item.price.toFixed(2)}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">${item.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    {item.rating && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Star className="w-3 h-3 fill-warning text-warning" /> {item.rating}
                        {item.calories && <span className="ml-2">• {item.calories} cal</span>}
                      </span>
                    )}
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="relative shrink-0">
                    <img src={item.image} alt={item.name} className="w-28 h-28 rounded-xl object-cover" loading="lazy" />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                      <AnimatePresence mode="wait">
                        {qty === 0 ? (
                          <motion.button
                            key="add"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            onClick={() => addItem(item, restaurant.id, restaurant.name)}
                            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-card border-2 border-primary text-primary shadow-md hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            ADD
                          </motion.button>
                        ) : (
                          <motion.div
                            key="qty"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-1 bg-primary rounded-lg shadow-md"
                          >
                            <button
                              onClick={() => updateQuantity(item.id, qty - 1)}
                              className="px-2 py-1.5 text-primary-foreground hover:opacity-80"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold text-primary-foreground w-4 text-center">{qty}</span>
                            <button
                              onClick={() => updateQuantity(item.id, qty + 1)}
                              className="px-2 py-1.5 text-primary-foreground hover:opacity-80"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
