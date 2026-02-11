import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedRestaurants from "@/components/home/FeaturedRestaurants";
import TrendingDishes from "@/components/home/TrendingDishes";
import OffersSection from "@/components/home/OffersSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategorySection />
      <OffersSection />
      <FeaturedRestaurants />
      <TrendingDishes />

      <footer className="py-12 bg-foreground text-background/70">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🍽️</span>
                <span className="text-lg font-bold font-display text-background">FeastFlow</span>
              </div>
              <p className="text-sm">Delicious food delivered to your doorstep in minutes.</p>
            </div>
            <div>
              <h4 className="font-semibold text-background mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-background transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-background mb-3 text-sm">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-background transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-background transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-background mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-background transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-background/10 text-center text-xs">
            © 2026 FeastFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
