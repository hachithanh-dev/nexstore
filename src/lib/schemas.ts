import { z } from "zod";
import { ORDER_STATUSES, PRODUCT_STATUSES, USER_ROLES } from "@/lib/constants";

// ========= Pagination =========
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).catch(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10).catch(10),
});

// ========= Products =========
export const ALLOWED_PRODUCT_SORT_FIELDS = [
  "createdAt",
  "name",
  "price",
  "stock",
  "category",
] as const;

export const productSortSchema = z.object({
  sortBy: z.enum(ALLOWED_PRODUCT_SORT_FIELDS).default("createdAt").catch("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc").catch("desc"),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  description: z.string().nullable().optional(),
  price: z.coerce.number().positive("Giá phải lớn hơn 0"),
  stock: z.coerce.number().int().min(0, "Tồn kho không thể âm").default(0),
  category: z.string().min(1, "Danh mục là bắt buộc"),
  image: z.string().nullable().optional(),
  status: z.enum(PRODUCT_STATUSES).default("active"),
  sku: z.string().min(1, "SKU là bắt buộc"),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm là bắt buộc").optional(),
  description: z.string().nullable().optional(),
  price: z.coerce.number().positive("Giá phải lớn hơn 0").optional(),
  stock: z.coerce.number().int().min(0, "Tồn kho không thể âm").optional(),
  category: z.string().min(1, "Danh mục là bắt buộc").optional(),
  image: z.string().nullable().optional(),
  status: z.enum(PRODUCT_STATUSES).optional(),
  sku: z.string().min(1, "SKU là bắt buộc").optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  "Cần ít nhất một trường để cập nhật"
);

// ========= Orders =========
export const createOrderSchema = z.object({
  userId: z.string().min(1, "User ID là bắt buộc"),
  status: z.enum(ORDER_STATUSES).default("pending"),
  note: z.string().nullable().optional(),
  shippingAddress: z.string().nullable().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().positive("Số lượng phải lớn hơn 0"),
      })
    )
    .min(1, "Cần ít nhất 1 sản phẩm"),
});

export const updateOrderSchema = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  note: z.string().nullable().optional(),
  shippingAddress: z.string().nullable().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  "Cần ít nhất một trường để cập nhật"
);

// ========= Users =========
export const updateUserSchema = z.object({
  id: z.string().min(1, "User ID là bắt buộc"),
  name: z.string().min(1).optional(),
  email: z.string().email("Email không hợp lệ").optional(),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").optional(),
  role: z.enum(USER_ROLES).optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
});

// ========= Checkout =========
export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().positive("Số lượng phải lớn hơn 0"),
      })
    )
    .min(1, "Giỏ hàng trống"),
  shippingAddress: z.string().min(5, "Địa chỉ giao hàng phải có ít nhất 5 ký tự"),
});

// ========= Helpers =========
export function parseSearchParams(
  searchParams: URLSearchParams,
  schema: z.ZodType
) {
  const raw: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    raw[key] = value;
  });
  return schema.safeParse(raw);
}
