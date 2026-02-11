import { Link } from "react-router-dom";
import { Star, Clock, MapPin } from "lucide-react";
import { Restaurant } from "@/data/mockData";
import { motion } from "framer-motion";

interface Props {
  restaurant: Restaurant;
  index?: number;
}

const RestaurantCard = ({ restaurant, index = 0 }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link
        to={`/restaurant/${restaurant.id}`}
        className="group block rounded-xl overflow-hidden bg-card card-hover border border-border/50"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
              <span className="text-sm font-semibold text-background bg-foreground/80 px-4 py-1.5 rounded-full">Closed</span>
            </div>
          )}
          {restaurant.discount && (
            <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-full bg-primary text-primary-foreground shadow-lg">
              {restaurant.discount}
            </span>
          )}
          {restaurant.promoted && (
            <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-medium rounded bg-foreground/70 text-background">
              Promoted
            </span>
          )}
          <div className="absolute bottom-3 right-3 px-2 py-1 text-xs font-semibold rounded-full glass">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {restaurant.deliveryTime}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display font-bold text-base truncate">{restaurant.name}</h3>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {restaurant.cuisine.join(" • ")}
              </p>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent/15 text-accent shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-sm font-bold">{restaurant.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {restaurant.distance}
            </span>
            <span>•</span>
            <span>{restaurant.deliveryFee === 0 ? "Free delivery" : `$${restaurant.deliveryFee} delivery`}</span>
            <span>•</span>
            <span>Min ${restaurant.minOrder}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RestaurantCard;
