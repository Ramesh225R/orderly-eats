import { Search } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-food.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Delicious food spread" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
      </div>

      <div className="container relative z-10 py-20 md:py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-background leading-tight">
            Delicious food,
            <br />
            <span className="text-primary">delivered fast.</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-background/80 max-w-md">
            Order from the best local restaurants with easy, on-demand delivery.
          </p>

          <div className="mt-8 flex gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="What are you craving?"
                className="w-full h-12 pl-12 pr-4 rounded-full bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-xl"
              />
            </div>
            <button className="h-12 px-6 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-xl">
              Search
            </button>
          </div>

          <div className="mt-6 flex gap-2 flex-wrap">
            {["🍕 Pizza", "🍔 Burgers", "🍣 Sushi", "🥗 Healthy"].map(tag => (
              <span key={tag} className="px-3 py-1.5 text-xs font-medium rounded-full bg-background/15 text-background/90 border border-background/20 backdrop-blur-sm">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
