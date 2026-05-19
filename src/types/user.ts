export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    orders: number;
  };
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  phone?: string;
  address?: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  page?: number;
  pageSize?: number;
}
