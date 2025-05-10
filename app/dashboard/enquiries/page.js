"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Archive, CheckCircle, Trash2 } from "lucide-react";

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/enquiries");
      
      if (!response.ok) {
        throw new Error("Failed to fetch enquiries");
      }
      
      const data = await response.json();
      setEnquiries(data);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      toast({
        title: "Error",
        description: "Failed to load enquiries. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    // In a real implementation, you would update the status via an API call
    // For now, we'll just update the local state
    setEnquiries((prev) =>
      prev.map((enquiry) =>
        enquiry.id === id ? { ...enquiry, status: newStatus } : enquiry
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Enquiry status changed to ${newStatus}.`,
    });
  };

  const handleDelete = async (id) => {
    // In a real implementation, you would delete via an API call
    // For now, we'll just update the local state
    setEnquiries((prev) => prev.filter((enquiry) => enquiry.id !== id));
    
    toast({
      title: "Enquiry Deleted",
      description: "The enquiry has been removed.",
    });
  };

  const getSortedEnquiries = () => {
    const filtered = filter === "all" 
      ? enquiries 
      : enquiries.filter(enquiry => enquiry.status === filter);
    
    return filtered.sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];
      
      if (sortBy === "timestamp") {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }
      
      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return <Badge variant="default">New</Badge>;
      case "in-progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "resolved":
        return <Badge variant="success">Resolved</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Enquiries</h2>
        <div className="flex space-x-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Enquiries</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Enquiries</CardTitle>
          <CardDescription>
            Manage and respond to client enquiries from your contact form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center my-8">
              <p>Loading enquiries...</p>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No enquiries found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("email")}
                    >
                      Email {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("service")}
                    >
                      Service {sortBy === "service" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("timestamp")}
                    >
                      Date {sortBy === "timestamp" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getSortedEnquiries().map((enquiry) => (
                    <TableRow key={enquiry.id}>
                      <TableCell className="font-medium">{enquiry.name}</TableCell>
                      <TableCell>{enquiry.email}</TableCell>
                      <TableCell>{enquiry.service}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {enquiry.message}
                      </TableCell>
                      <TableCell title={new Date(enquiry.timestamp).toLocaleString()}>
                        {formatDistanceToNow(new Date(enquiry.timestamp), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={enquiry.status} 
                          onValueChange={(value) => handleStatusChange(enquiry.id, value)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Status">
                              {getStatusBadge(enquiry.status)}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleStatusChange(enquiry.id, "resolved")}
                            title="Mark as Resolved"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleStatusChange(enquiry.id, "archived")}
                            title="Archive"
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(enquiry.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
