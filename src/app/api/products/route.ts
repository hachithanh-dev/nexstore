import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/require-admin";
import { auth } from "@/lib/auth";
import { isValidProductStatus } from "@/lib/constants";
import {
  paginationSchema,
  productSortSchema,
  createProductSchema,
} from "@/lib/schemas";

// GET /api/products - Public users only see active products; admins can see all.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await auth();
    const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const ids = (searchParams.get("ids") || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    // Validated pagination
    const { page, pageSize } = paginationSchema.parse({
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
    });

    // Validated sort (whitelist)
    const { sortBy, sortOrder } = productSortSchema.parse({
      sortBy: searchParams.get("sortBy"),
      sortOrder: searchParams.get("sortOrder"),
    });

    // Build where clause
    const where: Record<string, unknown> = {};

    if (ids.length > 0) {
      where.id = { in: ids };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (category) where.category = category;
    if (isAdmin) {
      if (status) {
        if (!isValidProductStatus(status)) {
          return errorResponse("Trạng thái sản phẩm không hợp lệ", 400);
        }
        where.status = status;
      }
    } else if (ids.length === 0) {
      where.status = "active";
    } else {
      where.status = "active";
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        const parsed = parseFloat(minPrice);
        if (!Number.isFinite(parsed) || parsed < 0) {
          return errorResponse("Giá tối thiểu không hợp lệ", 400);
        }
        (where.price as Record<string, number>).gte = parsed;
      }
      if (maxPrice) {
        const parsed = parseFloat(maxPrice);
        if (!Number.isFinite(parsed) || parsed < 0) {
          return errorResponse("Giá tối đa không hợp lệ", 400);
        }
        (where.price as Record<string, number>).lte = parsed;
      }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return successResponse(products, undefined, {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Get products error:", error);
    return errorResponse("Không thể tải danh sách sản phẩm", 500);
  }
}

// POST /api/products - Create a product (admin only)
export async function POST(req: NextRequest) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck.error) return adminCheck.error;

    const body = await req.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return errorResponse(firstError?.message || "Dữ liệu không hợp lệ", 400);
    }

    const { name, description, price, stock, category, image, status, sku } =
      parsed.data;

    // Check duplicate SKU
    const existing = await prisma.product.findUnique({ where: { sku } });
    if (existing) {
      return errorResponse("SKU đã tồn tại", 409);
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price,
        stock,
        category,
        image: image || null,
        status,
        sku,
      },
    });

    return successResponse(product, "Tạo sản phẩm thành công");
  } catch (error) {
    console.error("Create product error:", error);
    return errorResponse("Không thể tạo sản phẩm", 500);
  }
}
