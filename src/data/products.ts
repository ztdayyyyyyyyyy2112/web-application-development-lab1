
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Low Stock" | "Out of Stock";
}

export const products: Product[] = [
  { id: "P001", name: "iPhone 15", category: "Electronics", price: 18990000, stock: 25, status: "Active" },
  { id: "P002", name: "Samsung Galaxy S24", category: "Electronics", price: 20990000, stock: 12, status: "Active" },
  { id: "P003", name: "MacBook Air M3", category: "Computers", price: 26990000, stock: 7, status: "Low Stock" },
  { id: "P004", name: "Logitech MX Master 3S", category: "Accessories", price: 2490000, stock: 0, status: "Out of Stock" },
  { id: "P005", name: "Sony WH-1000XM5", category: "Audio", price: 7490000, stock: 18, status: "Active" },
  { id: "P006", name: "iPad Air", category: "Tablets", price: 15990000, stock: 6, status: "Low Stock" },
  { id: "P007", name: "Dell XPS 13", category: "Computers", price: 31990000, stock: 10, status: "Active" },
  { id: "P008", name: "Keychron K8 Pro", category: "Accessories", price: 2290000, stock: 33, status: "Active" },
  { id: "P009", name: "Apple Watch Series 9", category: "Wearables", price: 8990000, stock: 0, status: "Out of Stock" },
  { id: "P010", name: "ASUS ROG Zephyrus G14", category: "Computers", price: 39990000, stock: 4, status: "Low Stock" }
];
