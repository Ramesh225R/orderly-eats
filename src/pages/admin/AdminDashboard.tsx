import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, ShoppingBag, Store, Users, ArrowLeft } from "lucide-react";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminRestaurants from "@/components/admin/AdminRestaurants";
import AdminUsers from "@/components/admin/AdminUsers";

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">Manage orders, restaurants & users</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-11 rounded-xl">
            <TabsTrigger value="overview" className="gap-1.5 text-xs rounded-lg">
              <LayoutDashboard className="w-3.5 h-3.5" /> Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-1.5 text-xs rounded-lg">
              <ShoppingBag className="w-3.5 h-3.5" /> Orders
            </TabsTrigger>
            <TabsTrigger value="restaurants" className="gap-1.5 text-xs rounded-lg">
              <Store className="w-3.5 h-3.5" /> Restaurants
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5 text-xs rounded-lg">
              <Users className="w-3.5 h-3.5" /> Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview"><AdminOverview /></TabsContent>
          <TabsContent value="orders"><AdminOrders /></TabsContent>
          <TabsContent value="restaurants"><AdminRestaurants /></TabsContent>
          <TabsContent value="users"><AdminUsers /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
