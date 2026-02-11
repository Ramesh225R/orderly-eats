import { motion } from "framer-motion";
import { Timer } from "lucide-react";

const offers = [
  { id: 1, title: "50% OFF up to $10", subtitle: "Use code FEAST50 on your first order", bg: "from-primary to-coral", emoji: "🎉" },
  { id: 2, title: "Free Delivery", subtitle: "On orders above $25 this weekend", bg: "from-accent to-success", emoji: "🚀" },
  { id: 3, title: "Flat $5 OFF", subtitle: "On premium restaurant orders", bg: "from-coral to-primary", emoji: "⭐" },
];

const OffersSection = () => {
  return (
    <section className="py-12 bg-secondary/30">
      <div className="container">
        <div className="flex items-center gap-2 mb-6">
          <Timer className="w-5 h-5 text-warning" />
          <h2 className="text-2xl font-display font-bold">Limited Time Offers</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-6 rounded-2xl bg-gradient-to-br ${offer.bg} text-primary-foreground overflow-hidden cursor-pointer hover:shadow-xl transition-shadow`}
            >
              <span className="absolute -right-2 -top-2 text-6xl opacity-20">{offer.emoji}</span>
              <h3 className="text-lg font-display font-bold">{offer.title}</h3>
              <p className="text-sm opacity-90 mt-1">{offer.subtitle}</p>
              <button className="mt-4 px-4 py-1.5 text-xs font-semibold rounded-full bg-background/20 hover:bg-background/30 transition-colors">
                Order Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
