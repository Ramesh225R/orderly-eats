import { useState, useMemo } from "react";
import { restaurants } from "@/data/mockData";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import { SlidersHorizontal, Search } from "lucide-react";
import { motion } from "framer-motion";

const sortOptions = [
  { label: "Relevance", value: "relevance" },
  { label: "Rating", value: "rating" },
  { label: "Delivery Time", value: "time" },
  { label: "Cost: Low to High", value: "cost_asc" },
];

const cuisineFilters = ["All", "Italian", "Japanese", "American", "Indian", "Mexican", "Healthy", "Chinese", "Desserts"];

const Restaurants = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevance");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [openOnly, setOpenOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = [...restaurants];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(q) || r.cuisine.some(c => c.toLowerCase().includes(q)));
    }
    if (selectedCuisine !== "All") {
      result = result.filter(r => r.cuisine.includes(selectedCuisine));
    }
    if (openOnly) result = result.filter(r => r.isOpen);
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sort === "cost_asc") result.sort((a, b) => a.deliveryFee - b.deliveryFee);
    return result;
  }, [search, sort, selectedCuisine, vegOnly, openOnly]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-display font-bold mb-6"
        >
          All Restaurants
        </motion.h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search restaurants or cuisines..."
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="h-10 px-3 rounded-lg bg-card border border-border text-sm focus:outline-none"
            >
              {sortOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="checkbox" checked={openOnly} onChange={e => setOpenOnly(e.target.checked)} className="rounded" />
              Open Now
            </label>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {cuisineFilters.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCuisine(c)}
              className={`px-4 py-2 text-sm font-medium rounded-full border whitespace-nowrap transition-colors ${
                selectedCuisine === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-lg font-display font-semibold">No restaurants found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((r, i) => (
              <RestaurantCard key={r.id} restaurant={r} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
