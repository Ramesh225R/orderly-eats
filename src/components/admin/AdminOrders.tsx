import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUS_OPTIONS = ["placed", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"] as const;

const statusColors: Record<string, string> = {
  placed: "bg-muted text-muted-foreground",
  confirmed: "bg-primary/10 text-primary",
  preparing: "bg-warning/10 text-warning-foreground",
  out_for_delivery: "bg-accent/10 text-accent",
  delivered: "bg-accent text-accent-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders" as any)
      .select("*")
      .order("created_at", { ascending: false });
    setOrders((data as any[]) || []);
  };

  useEffect(() => {
    fetchOrders();
    // Real-time subscription
    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => fetchOrders())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders" as any)
      .update({ status: newStatus } as any)
      .eq("id", orderId);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Order updated" });
      fetchOrders();
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      <div className="p-5 border-b border-border/30">
        <h3 className="text-sm font-semibold">All Orders ({orders.length})</h3>
      </div>
      {orders.length === 0 ? (
        <p className="p-5 text-sm text-muted-foreground">No orders yet</p>
      ) : (
        <div className="divide-y divide-border/30">
          {orders.map((order: any) => (
            <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{order.order_number}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {new Date(order.created_at).toLocaleDateString()} • ${Number(order.total).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={`text-[10px] ${statusColors[order.status] || ""}`}>
                  {order.status?.replace("_", " ")}
                </Badge>
                <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v)}>
                  <SelectTrigger className="w-[160px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(s => (
                      <SelectItem key={s} value={s} className="text-xs capitalize">
                        {s.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
