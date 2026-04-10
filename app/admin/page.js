'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  ArrowUpRight,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
    recentOrders: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // For now, we'll fetch products and orders to calculate stats
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/orders')
      ]);

      const products = await productsRes.json();
      const orders = await ordersRes.json();

      const totalRevenue = orders
        .filter(order => order.status !== 'CANCELLED')
        .reduce((sum, order) => sum + order.totalAmount, 0);

      // Unique customers based on email
      const uniqueCustomers = new Set(orders.map(order => order.user.email)).size;

      setStats({
        revenue: totalRevenue,
        orders: orders.length,
        products: products.length,
        customers: uniqueCustomers,
        recentOrders: orders.slice(0, 5)
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Revenue', 
      value: `₹${stats.revenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    { 
      title: 'Total Orders', 
      value: stats.orders, 
      icon: ShoppingCart, 
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    { 
      title: 'Products', 
      value: stats.products, 
      icon: Package, 
      color: 'text-amber-600',
      bg: 'bg-amber-100'
    },
    { 
      title: 'Customers', 
      value: stats.customers, 
      icon: Users, 
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.bg} p-2 rounded-lg`}>
                  <Icon className={`${stat.color}`} size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>View and manage the latest customer activity.</CardDescription>
              </div>
              <Link href="/admin/orders">
                <Button variant="outline" size="sm" className="gap-2">
                  View All <ArrowUpRight size={16} />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.recentOrders.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No recent orders.</p>
              ) : (
                stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <ShoppingCart size={16} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{order.user.email}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">₹{order.totalAmount}</p>
                      <p className={`text-xs font-medium ${
                        order.status === 'DELIVERED' ? 'text-green-600' : 
                        order.status === 'CANCELLED' ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for store management.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/products" className="block">
              <Button className="w-full justify-start gap-3 py-6" variant="outline">
                <Package size={20} className="text-amber-600" />
                <div className="text-left">
                  <p className="font-semibold">Add New Product</p>
                  <p className="text-xs text-muted-foreground">Update your store inventory</p>
                </div>
              </Button>
            </Link>
            <Link href="/admin/orders" className="block">
              <Button className="w-full justify-start gap-3 py-6" variant="outline">
                <ShoppingCart size={20} className="text-blue-600" />
                <div className="text-left">
                  <p className="font-semibold">Check Orders</p>
                  <p className="text-xs text-muted-foreground">Process pending shipments</p>
                </div>
              </Button>
            </Link>
            <div className="pt-4 border-t mt-4">
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-primary" size={20} />
                  <p className="font-bold text-primary">Store Tip</p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Featured products appear at the top of your store page. Consider featuring your best-sellers or new arrivals.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
