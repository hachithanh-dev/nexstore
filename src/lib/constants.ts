// Centralized status and role constants for server-side validation

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PRODUCT_STATUSES = ["active", "draft", "archived"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const USER_ROLES = ["user", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export function isValidOrderStatus(s: string): s is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(s);
}

export function isValidProductStatus(s: string): s is ProductStatus {
  return (PRODUCT_STATUSES as readonly string[]).includes(s);
}

export function isValidUserRole(r: string): r is UserRole {
  return (USER_ROLES as readonly string[]).includes(r);
}
