"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { CheckCircle, Clock, SearchIcon, XCircle } from "lucide-react";

// Mock orders data
const orders = [
  {
    id: "ORD-001",
    customer: "John Smith",
    date: new Date("2023-11-10T14:32:21"),
    status: "Delivered",
    total: 249.99,
    items: 3,
  },
  {
    id: "ORD-002",
    customer: "Alice Johnson",
    date: new Date("2023-11-09T09:15:00"),
    status: "Processing",
    total: 129.95,
    items: 2,
  },
  {
    id: "ORD-003",
    customer: "Robert Davis",
    date: new Date("2023-11-08T16:20:10"),
    status: "Shipped",
    total: 349.50,
    items: 4,
  },
  {
    id: "ORD-004",
    customer: "Mary Wilson",
    date: new Date("2023-11-07T11:05:30"),
    status: "Delivered",
    total: 99.99,
    items: 1,
  },
  {
    id: "ORD-005",
    customer: "James Brown",
    date: new Date("2023-11-06T15:45:00"),
    status: "Cancelled",
    total: 199.99,
    items: 2,
  },
  {
    id: "ORD-006",
    customer: "Patricia Miller",
    date: new Date("2023-11-05T10:30:15"),
    status: "Delivered",
    total: 399.95,
    items: 5,
  },
  {
    id: "ORD-007",
    customer: "Michael Davis",
    date: new Date("2023-11-04T13:25:40"),
    status: "Processing",
    total: 149.99,
    items: 2,
  },
  {
    id: "ORD-008",
    customer: "Sarah Garcia",
    date: new Date("2023-11-03T09:10:05"),
    status: "Shipped",
    total: 279.98,
    items: 3,
  },
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(orders);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredOrders(orders);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = orders.filter(
        (order) =>
          order.id.toLowerCase().includes(lowercasedSearch) ||
          order.customer.toLowerCase().includes(lowercasedSearch) ||
          order.status.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Processing":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Shipped":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "Cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          View and manage customer orders
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Orders</CardTitle>
          <CardDescription>
            Manage and track your customer orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Export</Button>
              <Button>New Order</Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{format(order.date, "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{order.items}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${order.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}