import { restaurants } from "@/data/mockData";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeaturedRestaurants = () => {
  const featured = restaurants.filter(r => r.isOpen).slice(0, 4);

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-display font-bold">Featured Restaurants</h2>
            <p className="text-sm text-muted-foreground mt-1">Curated picks from our best partners</p>
          </div>
          <Link to="/restaurants" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((r, i) => (
            <RestaurantCard key={r.id} restaurant={r} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
