import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Store } from "lucide-react";
import { motion } from "framer-motion";

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", cuisine: "", address: "", delivery_time: "25-35 min", delivery_fee: "2.99" });
  const { toast } = useToast();

  const fetchRestaurants = async () => {
    const { data } = await supabase.from("restaurants" as any).select("*").order("created_at", { ascending: false });
    setRestaurants((data as any[]) || []);
  };

  useEffect(() => { fetchRestaurants(); }, []);

  const addRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("restaurants" as any).insert({
      name: form.name,
      cuisine: form.cuisine.split(",").map(c => c.trim()),
      address: form.address,
      delivery_time: form.delivery_time,
      delivery_fee: parseFloat(form.delivery_fee),
    } as any);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Restaurant added" });
      setShowForm(false);
      setForm({ name: "", cuisine: "", address: "", delivery_time: "25-35 min", delivery_fee: "2.99" });
      fetchRestaurants();
    }
  };

  const deleteRestaurant = async (id: string) => {
    await supabase.from("restaurants" as any).delete().eq("id", id);
    fetchRestaurants();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Restaurants ({restaurants.length})</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
        >
          <Plus className="w-3.5 h-3.5" /> Add Restaurant
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={addRestaurant}
          className="bg-card rounded-2xl border border-border/50 p-5 space-y-3"
        >
          <input placeholder="Restaurant Name" required maxLength={100} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-10 px-3 rounded-xl bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input placeholder="Cuisine (comma separated)" value={form.cuisine} onChange={e => setForm({ ...form, cuisine: e.target.value })} className="w-full h-10 px-3 rounded-xl bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full h-10 px-3 rounded-xl bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <div className="flex gap-3">
            <input placeholder="Delivery Time" value={form.delivery_time} onChange={e => setForm({ ...form, delivery_time: e.target.value })} className="flex-1 h-10 px-3 rounded-xl bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input placeholder="Delivery Fee" type="number" step="0.01" value={form.delivery_fee} onChange={e => setForm({ ...form, delivery_fee: e.target.value })} className="w-28 h-10 px-3 rounded-xl bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <button type="submit" className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">Save Restaurant</button>
        </motion.form>
      )}

      <div className="space-y-3">
        {restaurants.map((r: any) => (
          <div key={r.id} className="bg-card rounded-2xl border border-border/50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Store className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.cuisine?.join(", ")} • {r.address || "No address"}</p>
              </div>
            </div>
            <button onClick={() => deleteRestaurant(r.id)} className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors">
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </button>
          </div>
        ))}
        {restaurants.length === 0 && <p className="text-sm text-muted-foreground">No restaurants yet</p>}
      </div>
    </div>
  );
};

export default AdminRestaurants;
