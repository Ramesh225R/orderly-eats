import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, CheckCircle2, ChefHat, Bike, Package } from "lucide-react";
import { motion } from "framer-motion";

type OrderStatus = "placed" | "confirmed" | "preparing" | "out_for_delivery" | "delivered";

interface StatusStep {
  key: OrderStatus;
  label: string;
  description: string;
  icon: React.ReactNode;
  time?: string;
}

const steps: StatusStep[] = [
  { key: "placed", label: "Order Placed", description: "Your order has been received", icon: <Package className="w-5 h-5" />, time: "12:30 PM" },
  { key: "confirmed", label: "Confirmed", description: "Restaurant accepted your order", icon: <CheckCircle2 className="w-5 h-5" />, time: "12:32 PM" },
  { key: "preparing", label: "Preparing", description: "Chef is cooking your food", icon: <ChefHat className="w-5 h-5" />, time: "12:35 PM" },
  { key: "out_for_delivery", label: "Out for Delivery", description: "Rider is on the way", icon: <Bike className="w-5 h-5" /> },
  { key: "delivered", label: "Delivered", description: "Enjoy your meal!", icon: <MapPin className="w-5 h-5" /> },
];

const orderItems = [
  { name: "Margherita Pizza", qty: 1, price: 12.99 },
  { name: "Pepperoni Feast", qty: 2, price: 15.99 },
  { name: "Tiramisu", qty: 1, price: 7.99 },
];

const OrderTracking = () => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>("placed");
  const [eta, setEta] = useState(25);

  const currentIndex = steps.findIndex(s => s.key === currentStatus);

  // Simulate real-time status updates
  useEffect(() => {
    const statusOrder: OrderStatus[] = ["placed", "confirmed", "preparing", "out_for_delivery", "delivered"];
    let idx = 0;

    const interval = setInterval(() => {
      idx++;
      if (idx < statusOrder.length) {
        setCurrentStatus(statusOrder[idx]);
        setEta(prev => Math.max(0, prev - Math.floor(Math.random() * 8 + 3)));
      } else {
        clearInterval(interval);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-display font-bold">Order #FE2847</h1>
            <p className="text-xs text-muted-foreground">From La Bella Italia</p>
          </div>
        </div>

        {/* ETA Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-primary to-coral text-primary-foreground mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Estimated delivery</p>
              <p className="text-3xl font-display font-bold mt-1">
                {currentStatus === "delivered" ? "Delivered!" : `${eta} min`}
              </p>
              <p className="text-sm opacity-80 mt-1">
                {steps[currentIndex].description}
              </p>
            </div>
            <motion.div
              animate={{ rotate: currentStatus === "out_for_delivery" ? [0, -5, 5, 0] : 0 }}
              transition={{ repeat: currentStatus === "out_for_delivery" ? Infinity : 0, duration: 0.6 }}
              className="text-5xl"
            >
              {currentStatus === "delivered" ? "🎉" : currentStatus === "out_for_delivery" ? "🛵" : "👨‍🍳"}
            </motion.div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 mb-6">
          <h2 className="text-sm font-semibold mb-6">Order Status</h2>
          <div className="space-y-0">
            {steps.map((step, i) => {
              const isComplete = i <= currentIndex;
              const isCurrent = i === currentIndex;

              return (
                <div key={step.key} className="flex gap-4">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        backgroundColor: isComplete ? "hsl(var(--primary))" : "hsl(var(--secondary))",
                        scale: isCurrent ? 1.15 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isComplete ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.icon}
                    </motion.div>
                    {i < steps.length - 1 && (
                      <div className="w-0.5 h-10 relative overflow-hidden bg-secondary my-1 rounded-full">
                        <motion.div
                          initial={{ height: "0%" }}
                          animate={{ height: i < currentIndex ? "100%" : "0%" }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="absolute top-0 left-0 w-full bg-primary rounded-full"
                        />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-6 pt-2">
                    <p className={`text-sm font-semibold ${isComplete ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                    {step.time && isComplete && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> {step.time}
                      </span>
                    )}
                    {isCurrent && currentStatus !== "delivered" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1.5 flex items-center gap-1.5"
                      >
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                        </span>
                        <span className="text-[10px] font-medium text-primary">In progress</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Partner */}
        {(currentStatus === "out_for_delivery" || currentStatus === "delivered") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border/50 p-5 mb-6"
          >
            <h2 className="text-sm font-semibold mb-4">Delivery Partner</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl">
                  🧑
                </div>
                <div>
                  <p className="font-semibold text-sm">Alex Johnson</p>
                  <p className="text-xs text-muted-foreground">⭐ 4.9 • 1,200+ deliveries</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                </button>
                <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors">
                  <MessageCircle className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Order Summary */}
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <h2 className="text-sm font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {orderItems.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.qty}x {item.name}
                </span>
                <span className="font-medium">${(item.qty * item.price).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-3 flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>$2.99</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">${(orderItems.reduce((s, i) => s + i.qty * i.price, 0) + 2.99).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
