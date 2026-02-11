import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, User, MapPin } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { totalItems, setIsOpen } = useCart();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 glass shadow-sm">
      <div className="container flex items-center justify-between h-16 gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🍽️</span>
          <span className="text-xl font-bold font-display text-gradient">FeastFlow</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          <span>Delivering to</span>
          <button className="font-semibold text-foreground underline decoration-primary underline-offset-2">
            Current Location
          </button>
        </div>

        <div className="hidden sm:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search restaurants, cuisines, dishes..."
              className="w-full h-10 pl-10 pr-4 rounded-full bg-secondary text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/" className="hidden md:flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-full hover:bg-secondary transition-colors">
            <User className="w-4 h-4" />
            <span>Sign In</span>
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full bg-coral text-coral-foreground"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
