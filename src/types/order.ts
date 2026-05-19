export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  note: string | null;
  shippingAddress: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    image: string | null;
    sku: string;
  };
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderFormData {
  userId: string;
  status: OrderStatus;
  note?: string;
  shippingAddress?: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

export interface OrderFilters {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export const ORDER_STATUSES = [
  {
    value: "pending",
    label: "Chờ xử lý",
    color: "bg-amber-500",
    icon: "Clock",
  },
  {
    value: "processing",
    label: "Đang xử lý",
    color: "bg-blue-500",
    icon: "Loader",
  },
  {
    value: "shipped",
    label: "Đang giao",
    color: "bg-indigo-500",
    icon: "Truck",
  },
  {
    value: "delivered",
    label: "Đã giao",
    color: "bg-emerald-500",
    icon: "CheckCircle",
  },
  {
    value: "cancelled",
    label: "Đã hủy",
    color: "bg-red-500",
    icon: "XCircle",
  },
] as const;
