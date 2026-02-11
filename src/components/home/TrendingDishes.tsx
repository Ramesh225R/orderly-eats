import { restaurants } from "@/data/mockData";
import { Star, Clock, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

const TrendingDishes = () => {
  const { addItem } = useCart();
  const dishes = restaurants
    .flatMap(r => r.menu.map(m => ({ ...m, restaurantId: r.id, restaurantName: r.name })))
    .filter(d => d.isBestseller)
    .slice(0, 6);

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex items-center gap-2 mb-6">
          <Flame className="w-5 h-5 text-coral" />
          <h2 className="text-2xl font-display font-bold">Trending Now</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {dishes.map((dish, i) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex gap-4 p-4 rounded-xl bg-card border border-border/50 card-hover"
            >
              <img
                src={dish.image}
                alt={dish.name}
                className="w-24 h-24 rounded-lg object-cover shrink-0"
                loading="lazy"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-sm border ${dish.isVeg ? "border-accent bg-accent/20" : "border-coral bg-coral/20"}`} />
                    {dish.isBestseller && (
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">★ BESTSELLER</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mt-1 truncate">{dish.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{dish.restaurantName}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">${dish.price.toFixed(2)}</span>
                    {dish.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">${dish.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addItem(dish, dish.restaurantId, dish.restaurantName)}
                    className="px-3 py-1 text-xs font-semibold rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    ADD
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingDishes;
