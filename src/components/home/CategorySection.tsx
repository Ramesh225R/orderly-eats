import { categories } from "@/data/mockData";
import { motion } from "framer-motion";

const CategorySection = () => {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-2xl font-display font-bold mb-6">What's on your mind?</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="flex flex-col items-center gap-2 min-w-[80px] group"
            >
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl group-hover:bg-primary/10 transition-colors shadow-sm">
                {cat.icon}
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {cat.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
