import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, ShoppingBag, Store, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const AdminOverview = () => {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, restaurants: 0, users: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [ordersRes, restaurantsRes, usersRes] = await Promise.all([
        supabase.from("orders" as any).select("*"),
        supabase.from("restaurants" as any).select("id"),
        supabase.from("profiles" as any).select("id"),
      ]);

      const orders = (ordersRes.data as any[]) || [];
      setStats({
        orders: orders.length,
        revenue: orders.reduce((s: number, o: any) => s + Number(o.total || 0), 0),
        restaurants: (restaurantsRes.data as any[])?.length || 0,
        users: (usersRes.data as any[])?.length || 0,
      });
      setRecentOrders(orders.slice(-5).reverse());
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Orders", value: stats.orders, icon: ShoppingBag, color: "text-primary" },
    { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: "text-accent" },
    { label: "Restaurants", value: stats.restaurants, icon: Store, color: "text-coral" },
    { label: "Users", value: stats.users, icon: Users, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl border border-border/50 p-5"
          >
            <card.icon className={`w-5 h-5 ${card.color} mb-3`} />
            <p className="text-2xl font-display font-bold">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border/50 p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Recent Orders
        </h3>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between text-sm border-b border-border/30 pb-3 last:border-0">
                <div>
                  <p className="font-semibold">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground capitalize">{order.status?.replace("_", " ")}</p>
                </div>
                <span className="font-semibold text-primary">${Number(order.total).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
