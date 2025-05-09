"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart, LineChart } from "../../components/ui/chart";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { getCurrentUser } from "../../lib/auth";
import { ArrowRight, ArrowUpRight, PackageOpen, TrendingUp, Users, BadgeDollarSign } from "lucide-react";
import { getInventoryStats, getInventorySummary, getRecentInventory } from "../../lib/inventory";
import { RecentInventoryList } from "../../components/dashboard/recent-inventory";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentItems, setRecentItems] = useState([]);
  const [inventorySummary, setInventorySummary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        setUser(getCurrentUser());
        setStats(getInventoryStats());
        setRecentItems(getRecentInventory());
        setInventorySummary(getInventorySummary());
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const salesData = [
    { name: "Jan", total: 1700 },
    { name: "Feb", total: 2400 },
    { name: "Mar", total: 1800 },
    { name: "Apr", total: 2800 },
    { name: "May", total: 3200 },
    { name: "Jun", total: 3800 },
    { name: "Jul", total: 4300 },
  ];

  const inventoryData = [
    { name: "Jan", Electronics: 45, Clothing: 35, Food: 20 },
    { name: "Feb", Electronics: 50, Clothing: 45, Food: 25 },
    { name: "Mar", Electronics: 60, Clothing: 40, Food: 30 },
    { name: "Apr", Electronics: 70, Clothing: 50, Food: 40 },
    { name: "May", Electronics: 80, Clothing: 55, Food: 45 },
    { name: "Jun", Electronics: 85, Clothing: 60, Food: 55 },
    { name: "Jul", Electronics: 90, Clothing: 70, Food: 60 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.username || "Admin"}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/inventory">
            Manage Inventory
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <PackageOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.newProductsPercent || 0}% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalRevenue?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.revenueGrowthPercent || 0}% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeCustomers || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.customerGrowthPercent || 0}% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.growthRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.growthRateChange || 0}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Monthly revenue for the current year
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <LineChart 
                  data={salesData} 
                  categories={["total"]} 
                  index="name" 
                  colors={["hsl(var(--chart-1))"]}
                  valueFormatter={(value) => `$${value.toLocaleString()}`}
                />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Inventory</CardTitle>
                <CardDescription>
                  Recently added inventory items
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] overflow-auto">
                <RecentInventoryList items={recentItems} />
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild className="w-full">
                  <Link href="/dashboard/inventory">
                    View all inventory
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Categories</CardTitle>
              <CardDescription>
                Distribution of inventory across categories
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <BarChart 
                data={inventoryData} 
                categories={["Electronics", "Clothing", "Food"]} 
                index="name"
                colors={["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
              <CardDescription>
                Monthly sales performance over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <LineChart 
                data={salesData} 
                categories={["total"]} 
                index="name" 
                colors={["hsl(var(--chart-2))"]}
                valueFormatter={(value) => `$${value.toLocaleString()}`}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}