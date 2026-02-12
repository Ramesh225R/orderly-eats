import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Shield, User } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchUsers = async () => {
    const { data: profiles } = await supabase.from("profiles" as any).select("*");
    if (!profiles) return setUsers([]);

    const { data: roles } = await supabase.from("user_roles" as any).select("*");
    const roleMap: Record<string, string[]> = {};
    (roles as any[] || []).forEach((r: any) => {
      if (!roleMap[r.user_id]) roleMap[r.user_id] = [];
      roleMap[r.user_id].push(r.role);
    });

    setUsers((profiles as any[]).map((p: any) => ({
      ...p,
      roles: roleMap[p.user_id] || ["user"],
    })));
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleAdmin = async (userId: string, currentlyAdmin: boolean) => {
    if (currentlyAdmin) {
      await supabase.from("user_roles" as any).delete().eq("user_id", userId).eq("role", "admin");
    } else {
      await supabase.from("user_roles" as any).insert({ user_id: userId, role: "admin" } as any);
    }
    toast({ title: currentlyAdmin ? "Admin removed" : "Admin granted" });
    fetchUsers();
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      <div className="p-5 border-b border-border/30">
        <h3 className="text-sm font-semibold">Users ({users.length})</h3>
      </div>
      {users.length === 0 ? (
        <p className="p-5 text-sm text-muted-foreground">No users yet</p>
      ) : (
        <div className="divide-y divide-border/30">
          {users.map((u: any) => {
            const isAdmin = u.roles.includes("admin");
            return (
              <div key={u.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{u.full_name || "Unnamed"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {u.roles.map((r: string) => (
                    <Badge key={r} variant={r === "admin" ? "default" : "secondary"} className="text-[10px] capitalize">
                      {r}
                    </Badge>
                  ))}
                  <button
                    onClick={() => toggleAdmin(u.user_id, isAdmin)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isAdmin ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                    title={isAdmin ? "Remove admin" : "Make admin"}
                  >
                    <Shield className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
