import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, CheckCircle2, ChefHat, Bike, Package } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import LiveMap from "@/components/tracking/LiveMap";

type OrderStatus = "placed" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";

interface StatusStep {
  key: OrderStatus;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const steps: StatusStep[] = [
  { key: "placed", label: "Order Placed", description: "Your order has been received", icon: <Package className="w-5 h-5" /> },
  { key: "confirmed", label: "Confirmed", description: "Restaurant accepted your order", icon: <CheckCircle2 className="w-5 h-5" /> },
  { key: "preparing", label: "Preparing", description: "Chef is cooking your food", icon: <ChefHat className="w-5 h-5" /> },
  { key: "out_for_delivery", label: "Out for Delivery", description: "Rider is on the way", icon: <Bike className="w-5 h-5" /> },
  { key: "delivered", label: "Delivered", description: "Enjoy your meal!", icon: <MapPin className="w-5 h-5" /> },
];

const OrderTrackingLive = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }

    const fetchOrder = async () => {
      const { data } = await supabase
        .from("orders" as any)
        .select("*")
        .eq("id", orderId)
        .maybeSingle();
      setOrder(data);
      setLoading(false);
    };
    fetchOrder();

    // Real-time updates
    const channel = supabase
      .channel(`order-${orderId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` }, (payload) => {
        setOrder(payload.new);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [orderId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">Order not found</p>
      <Link to="/" className="text-primary text-sm font-semibold">Go home</Link>
    </div>
  );

  const currentStatus = order.status as OrderStatus;
  const currentIndex = steps.findIndex(s => s.key === currentStatus);
  const riderProgress = Number(order.rider_progress || 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-display font-bold">Order #{order.order_number}</h1>
            <p className="text-xs text-muted-foreground">Live tracking</p>
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
                {currentStatus === "delivered" ? "Delivered!" : currentStatus === "cancelled" ? "Cancelled" : `${order.eta_minutes || 0} min`}
              </p>
              <p className="text-sm opacity-80 mt-1">
                {steps[Math.max(0, currentIndex)]?.description}
              </p>
            </div>
            <div className="text-5xl">
              {currentStatus === "delivered" ? "🎉" : currentStatus === "out_for_delivery" ? "🛵" : "👨‍🍳"}
            </div>
          </div>
        </motion.div>

        {/* Live Map */}
        {(currentStatus === "out_for_delivery" || currentStatus === "delivered") && (
          <LiveMap progress={riderProgress} isActive={currentStatus === "out_for_delivery"} />
        )}

        {/* Progress Steps */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 mb-6">
          <h2 className="text-sm font-semibold mb-6">Order Status</h2>
          <div className="space-y-0">
            {steps.map((step, i) => {
              const isComplete = i <= currentIndex;
              const isCurrent = i === currentIndex;

              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        backgroundColor: isComplete ? "hsl(var(--primary))" : "hsl(var(--secondary))",
                        scale: isCurrent ? 1.15 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isComplete ? "text-primary-foreground" : "text-muted-foreground"}`}
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
                  <div className="pb-6 pt-2">
                    <p className={`text-sm font-semibold ${isComplete ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                    {isCurrent && currentStatus !== "delivered" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1.5 flex items-center gap-1.5">
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
        {order.rider_name && (currentStatus === "out_for_delivery" || currentStatus === "delivered") && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border/50 p-5 mb-6">
            <h2 className="text-sm font-semibold mb-4">Delivery Partner</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl">🧑</div>
                <div>
                  <p className="font-semibold text-sm">{order.rider_name}</p>
                  <p className="text-xs text-muted-foreground">⭐ 4.9</p>
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
            {(order.items as any[] || []).map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.qty || item.quantity}x {item.name}</span>
                <span className="font-medium">${((item.qty || item.quantity) * item.price).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-3 flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>${Number(order.delivery_fee).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingLive;
