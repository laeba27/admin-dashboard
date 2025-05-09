"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useToast } from "../../../hooks/use-toast";
import { getPaginatedInventory, getInventoryCategories, resetInventoryToDefaults } from "../../../lib/inventory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  FilterIcon,
  MoreHorizontal,
  Package,
  PackagePlus,
  PenIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import { AddInventoryForm } from "../../../components/inventory/add-inventory-form";
import { EditInventoryForm } from "../../../components/inventory/edit-inventory-form";
import { DeleteInventoryDialog } from "../../../components/inventory/delete-inventory-dialog";
import { format } from "date-fns";

export default function InventoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  // Current page and filters from URL params
  const currentPage = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const searchQuery = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";
  const statusFilter = searchParams.get("status") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  
  // State
  const [inventory, setInventory] = useState({ items: [], pagination: {} });
  const [categories, setCategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchQuery,
    category: categoryFilter || "all",
    status: statusFilter || "all",
  });
  
  // Load inventory data
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      try {
        // Get inventory data from the library (which now uses localStorage)
        const inventoryData = getPaginatedInventory(
          currentPage,
          pageSize,
          {
            search: searchQuery,
            category: categoryFilter,
            status: statusFilter,
          },
          sortBy,
          sortOrder
        );
        setInventory(inventoryData);
        setCategories(getInventoryCategories());
      } catch (error) {
        console.error("Error loading inventory data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentPage, pageSize, searchQuery, categoryFilter, statusFilter, sortBy, sortOrder]);
  
  // Update URL with filters and pagination
  const updateSearchParams = (params) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Clear page when filters change
    if (params.search !== undefined || params.category !== undefined || params.status !== undefined) {
      newParams.delete("page");
    }
    
    // Update or remove params
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    router.push(`${pathname}?${newParams.toString()}`);
  };
  
  // Handle sort change
  const handleSort = (column) => {
    if (sortBy === column) {
      updateSearchParams({ sortOrder: sortOrder === "asc" ? "desc" : "asc" });
    } else {
      updateSearchParams({ sortBy: column, sortOrder: "asc" });
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    // Convert "all" to empty string for the API
    const apiValue = value === "all" ? "" : value;
    setFilters((prev) => ({ ...prev, [key]: value }));
    updateSearchParams({ [key]: apiValue });
  };

  // Apply filters
  const applyFilters = () => {
    updateSearchParams(filters);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({ search: "", category: "all", status: "all" });
    updateSearchParams({ page: "1", search: "", category: "", status: "" });
  };
  
  // Handle adding an item
  const handleAddItem = (newItem) => {
    setIsAddDialogOpen(false);
    
    // Set sort to createdAt/desc to show newest item at the top
    const updatedSortBy = "createdAt";
    const updatedSortOrder = "desc";
    
    // Reset to page 1 to see the new item
    const inventoryData = getPaginatedInventory(
      1, // Reset to first page
      pageSize,
      {
        search: searchQuery,
        category: categoryFilter,
        status: statusFilter,
      },
      updatedSortBy,
      updatedSortOrder
    );
    
    setInventory(inventoryData);
    
    // Update URL params to reflect the new sorting and page
    updateSearchParams({ 
      page: "1",
      sortBy: updatedSortBy,
      sortOrder: updatedSortOrder
    });
    
    toast({
      title: "Item Added",
      description: `${newItem.name} has been added to inventory and saved to browser storage.`,
      variant: "success",
    });
  };
  
  // Handle editing an item
  const handleEditItem = (updatedItem) => {
    setIsEditDialogOpen(false);
    
    // Refresh data while maintaining the current sort and pagination
    const inventoryData = getPaginatedInventory(
      currentPage,
      pageSize,
      {
        search: searchQuery,
        category: categoryFilter,
        status: statusFilter,
      },
      sortBy,
      sortOrder
    );
    setInventory(inventoryData);
    
    toast({
      title: "Item Updated",
      description: `${updatedItem.name} has been updated and saved to browser storage.`,
      variant: "success",
    });
  };
  
  // Handle deleting an item
  const handleDeleteItem = () => {
    setIsDeleteDialogOpen(false);
    
    // Get the item name before it's deleted
    const itemName = selectedItem?.name || "Item";
    
    // Refresh data while maintaining the current sort
    const inventoryData = getPaginatedInventory(
      // If we're on the last page and it's now empty, go to previous page
      inventory.items.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage,
      pageSize,
      {
        search: searchQuery,
        category: categoryFilter,
        status: statusFilter,
      },
      sortBy,
      sortOrder
    );
    
    setInventory(inventoryData);
    
    // If we moved to previous page, update URL
    if (inventory.items.length === 1 && currentPage > 1) {
      updateSearchParams({ page: (currentPage - 1).toString() });
    }
    
    toast({
      title: "Item Deleted",
      description: `${itemName} has been deleted from inventory and removed from browser storage.`,
      variant: "success",
    });
  };

  const handleResetInventory = () => {
    if (confirm("Are you sure you want to reset the inventory to default values? This will delete all your changes.")) {
      const success = resetInventoryToDefaults();
      if (success) {
        // Refresh the inventory data with defaults
        const inventoryData = getPaginatedInventory(1, pageSize, {}, "createdAt", "desc");
        setInventory(inventoryData);
        setCategories(getInventoryCategories());
        
        // Reset URL parameters
        updateSearchParams({ 
          page: "1", 
          search: "", 
          category: "", 
          status: "", 
          sortBy: "createdAt", 
          sortOrder: "desc" 
        });
        
        // Update filters
        setFilters({
          search: "",
          category: "all",
          status: "all"
        });
        
        toast({
          title: "Inventory Reset",
          description: "The inventory has been reset to default values. All customizations have been removed.",
          variant: "info",
        });
      } else {
        toast({
          title: "Reset Failed",
          description: "There was a problem resetting the inventory.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage your inventory, add new items, and update existing ones
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PackagePlus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Inventory Item</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new item to your inventory.
                </DialogDescription>
              </DialogHeader>
              <AddInventoryForm 
                onSubmit={handleAddItem}
                onCancel={() => setIsAddDialogOpen(false)}
                categories={categories}
              />
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleResetInventory}>
            Reset to Defaults
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Inventory Items</CardTitle>
          <CardDescription>
            {inventory.pagination.totalItems} items in your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                className="pl-8"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Any Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Status</SelectItem>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={resetFilters}>
                <FilterIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-1">
                      Name
                      {sortBy === "name" && (
                        sortOrder === "asc" ? 
                          <ArrowUpIcon className="h-4 w-4" /> : 
                          <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                    <div className="flex items-center gap-1">
                      Category
                      {sortBy === "category" && (
                        sortOrder === "asc" ? 
                          <ArrowUpIcon className="h-4 w-4" /> : 
                          <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("createdAt")}>
                    <div className="flex items-center gap-1">
                      Date Added
                      {sortBy === "createdAt" && (
                        sortOrder === "asc" ? 
                          <ArrowUpIcon className="h-4 w-4" /> : 
                          <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => handleSort("stock")}>
                    <div className="flex items-center justify-end gap-1">
                      Stock
                      {sortBy === "stock" && (
                        sortOrder === "asc" ? 
                          <ArrowUpIcon className="h-4 w-4" /> : 
                          <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => handleSort("price")}>
                    <div className="flex items-center justify-end gap-1">
                      Price
                      {sortBy === "price" && (
                        sortOrder === "asc" ? 
                          <ArrowUpIcon className="h-4 w-4" /> : 
                          <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                    <div className="flex items-center gap-1">
                      Status
                      {sortBy === "status" && (
                        sortOrder === "asc" ? 
                          <ArrowUpIcon className="h-4 w-4" /> : 
                          <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : inventory.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No items found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  inventory.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="relative h-10 w-10 overflow-hidden rounded-md">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        {item.createdAt ? format(new Date(item.createdAt), "MMM d, yyyy 'at' h:mm a") : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">{item.stock}</TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className={`
                          inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                          ${item.status === "In Stock" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                            : item.status === "Low Stock"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }
                        `}>
                          {item.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedItem(item);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <PenIcon className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setSelectedItem(item);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2Icon className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min(inventory.pagination.totalItems, 1 + (currentPage - 1) * pageSize)} to{" "}
              {Math.min(currentPage * pageSize, inventory.pagination.totalItems)} of{" "}
              {inventory.pagination.totalItems} items
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={`${pathname}?${new URLSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      page: Math.max(1, currentPage - 1).toString(),
                    })}`}
                    aria-disabled={currentPage <= 1}
                    tabIndex={currentPage <= 1 ? -1 : 0}
                  />
                </PaginationItem>
                {Array.from(
                  { length: Math.min(5, inventory.pagination.totalPages) },
                  (_, i) => {
                    // Calculate page numbers to show based on current page
                    let pageNum;
                    if (inventory.pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else {
                      const middlePage = Math.min(
                        Math.max(3, currentPage),
                        inventory.pagination.totalPages - 2
                      );
                      pageNum = i + middlePage - 2;
                    }
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href={`${pathname}?${new URLSearchParams({
                            ...Object.fromEntries(searchParams.entries()),
                            page: pageNum.toString(),
                          })}`}
                          isActive={pageNum === currentPage}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                )}
                <PaginationItem>
                  <PaginationNext
                    href={`${pathname}?${new URLSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      page: Math.min(inventory.pagination.totalPages, currentPage + 1).toString(),
                    })}`}
                    aria-disabled={currentPage >= inventory.pagination.totalPages}
                    tabIndex={currentPage >= inventory.pagination.totalPages ? -1 : 0}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>
              Make changes to the inventory item details.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <EditInventoryForm
              item={selectedItem}
              onSubmit={handleEditItem}
              onCancel={() => setIsEditDialogOpen(false)}
              categories={categories}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteInventoryDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        item={selectedItem}
        onDelete={handleDeleteItem}
      />
    </div>
  );
}