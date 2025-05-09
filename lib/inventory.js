

// Sample default inventory items
const defaultInventoryItems = [
  {
    id: "inv-001",
    name: "Wireless Headphones",
    category: "Electronics",
    stock: 45,
    price: 99.99,
    status: "In Stock",
    createdAt: "2023-10-15T10:20:30Z",
    updatedAt: "2023-11-05T14:25:12Z",
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "inv-002",
    name: "Smartphone Pro",
    category: "Electronics",
    stock: 23,
    price: 999.99,
    status: "In Stock",
    createdAt: "2023-10-18T11:30:00Z",
    updatedAt: "2023-11-02T09:15:22Z",
    image: "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "inv-003",
    name: "Leather Jacket",
    category: "Clothing",
    stock: 15,
    price: 199.99,
    status: "Low Stock",
    createdAt: "2023-10-20T15:45:10Z",
    updatedAt: "2023-11-01T16:20:45Z",
    image: "https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "inv-004",
    name: "Smart Watch",
    category: "Electronics",
    stock: 30,
    price: 249.99,
    status: "In Stock",
    createdAt: "2023-10-22T09:50:30Z",
    updatedAt: "2023-10-30T11:10:15Z",
    image: "https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "inv-005",
    name: "Denim Jeans",
    category: "Clothing",
    stock: 50,
    price: 79.99,
    status: "In Stock",
    createdAt: "2023-10-25T14:20:00Z",
    updatedAt: "2023-10-28T10:30:45Z",
    image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "inv-006",
    name: "Bluetooth Speaker",
    category: "Electronics",
    stock: 12,
    price: 149.99,
    status: "Low Stock",
    createdAt: "2023-10-26T16:15:30Z",
    updatedAt: "2023-10-27T13:45:20Z",
    image: "https://images.pexels.com/photos/1706694/pexels-photo-1706694.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "inv-007",
    name: "Tennis Shoes",
    category: "Footwear",
    stock: 35,
    price: 129.99,
    status: "In Stock",
    createdAt: "2023-10-27T10:10:10Z",
    updatedAt: "2023-10-27T10:10:10Z",
    image: "https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "inv-008",
    name: "Coffee Maker",
    category: "Appliances",
    stock: 8,
    price: 199.99,
    status: "Low Stock",
    createdAt: "2023-10-28T08:30:00Z",
    updatedAt: "2023-10-28T08:30:00Z",
    image: "https://images.pexels.com/photos/4350110/pexels-photo-4350110.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "inv-009",
    name: "Winter Coat",
    category: "Clothing",
    stock: 0,
    price: 249.99,
    status: "Out of Stock",
    createdAt: "2023-10-29T11:45:30Z",
    updatedAt: "2023-10-29T11:45:30Z",
    image: "https://images.pexels.com/photos/6626742/pexels-photo-6626742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "inv-010",
    name: "Gaming Console",
    category: "Electronics",
    stock: 18,
    price: 499.99,
    status: "In Stock",
    createdAt: "2023-10-30T13:20:45Z",
    updatedAt: "2023-10-30T13:20:45Z",
    image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

// Initialize inventory from localStorage or use defaults
let inventoryItems = [];

// Load inventory from localStorage (if available)
const loadInventoryFromStorage = () => {
  if (typeof window !== 'undefined') {
    const storedInventory = localStorage.getItem('inventoryItems');
    if (storedInventory) {
      try {
        return JSON.parse(storedInventory);
      } catch (error) {
        console.error("Error parsing inventory from localStorage:", error);
      }
    }
  }
  return [...defaultInventoryItems];
};

// Save inventory to localStorage
const saveInventoryToStorage = (items) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('inventoryItems', JSON.stringify(items));
    } catch (error) {
      console.error("Error saving inventory to localStorage:", error);
    }
  }
};

// Initialize inventory
try {
  inventoryItems = loadInventoryFromStorage();
} catch (error) {
  console.error("Error loading inventory:", error);
  inventoryItems = [...defaultInventoryItems];
}

// Get all inventory items
export function getInventoryItems() {
  return [...inventoryItems];
}

// Get paginated inventory items
export function getPaginatedInventory(page = 1, pageSize = 10, filters = {}, sortBy = null, sortOrder = 'asc') {
  let filteredItems = [...inventoryItems];
  
  // Apply filters
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm) || 
      item.category.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filters.category) {
    filteredItems = filteredItems.filter(item => item.category === filters.category);
  }
  
  if (filters.status) {
    filteredItems = filteredItems.filter(item => item.status === filters.status);
  }
  
  // Apply sorting
  if (sortBy) {
    filteredItems.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });
  }
  
  // Calculate pagination
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = filteredItems.slice(start, end);
  
  return {
    items,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages
    }
  };
}

// Get a single inventory item by ID
export function getInventoryItem(id) {
  return inventoryItems.find(item => item.id === id);
}

// Get recent inventory items
export function getRecentInventory(limit = 5) {
  return [...inventoryItems]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
}

// Get inventory stats for dashboard
export function getInventoryStats() {
  return {
    totalProducts: inventoryItems.length,
    lowStockItems: inventoryItems.filter(item => item.status === "Low Stock").length,
    outOfStockItems: inventoryItems.filter(item => item.status === "Out of Stock").length,
    totalRevenue: 125000,
    revenueGrowthPercent: 12.5,
    newProductsPercent: 8.3,
    activeCustomers: 450,
    customerGrowthPercent: 5.2,
    growthRate: 15.7,
    growthRateChange: 2.3
  };
}

// Get inventory categories
export function getInventoryCategories() {
  const categories = [...new Set(inventoryItems.map(item => item.category))];
  return categories;
}

// Get inventory summary data
export function getInventorySummary() {
  const categories = getInventoryCategories();
  return categories.map(category => {
    const items = inventoryItems.filter(item => item.category === category);
    const totalValue = items.reduce((sum, item) => sum + (item.price * item.stock), 0);
    const totalItems = items.length;
    
    return {
      category,
      totalItems,
      totalValue,
      averagePrice: totalValue / totalItems
    };
  });
}

// Add a new inventory item
export function addInventoryItem(item) {
  const newItem = {
    ...item,
    id: `inv-${String(inventoryItems.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  inventoryItems.push(newItem);
  
  //  localStorage
  saveInventoryToStorage(inventoryItems);
  
  return newItem;
}

// Update an existing inventory item
export function updateInventoryItem(id, updates) {
  const index = inventoryItems.findIndex(item => item.id === id);
  
  if (index === -1) {
    throw new Error(`Inventory item with ID ${id} not found`);
  }
  
  inventoryItems[index] = {
    ...inventoryItems[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  // Save to localStorage
  saveInventoryToStorage(inventoryItems);
  
  return inventoryItems[index];
}

// Delete an inventory item
export function deleteInventoryItem(id) {
  const index = inventoryItems.findIndex(item => item.id === id);
  
  if (index === -1) {
    throw new Error(`Inventory item with ID ${id} not found`);
  }
  
  const deletedItem = inventoryItems[index];
  inventoryItems.splice(index, 1);
  
  // Save to localStorage
  saveInventoryToStorage(inventoryItems);
  
  return deletedItem;
}

// Reset inventory 
export function resetInventoryToDefaults() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('inventoryItems');
      inventoryItems = [...defaultInventoryItems];
      
      return true;
    } catch (error) {
      console.error("Error resetting inventory:", error);
      return false;
    }
  }
  return false;
}