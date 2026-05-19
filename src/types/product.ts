export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  image: string | null;
  status: "active" | "draft" | "archived";
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  status: "active" | "draft" | "archived";
  sku: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

export const PRODUCT_CATEGORIES = [
  "Laptop",
  "Phone",
  "Tablet",
  "Accessories",
  "Wearable",
  "Monitor",
  "Storage",
  "Other",
] as const;

export const PRODUCT_STATUSES = [
  { value: "active", label: "Active", color: "bg-emerald-500" },
  { value: "draft", label: "Draft", color: "bg-amber-500" },
  { value: "archived", label: "Archived", color: "bg-slate-500" },
] as const;
