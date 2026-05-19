import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/require-admin";
import { isValidOrderStatus } from "@/lib/constants";
import { createOrderSchema, paginationSchema } from "@/lib/schemas";
import { v4 as uuidv4 } from "uuid";
import type { Prisma } from "@prisma/client";

type OrderLine = {
  productId: string;
  quantity: number;
};

function shouldReserveInventory(status: string) {
  return status !== "cancelled";
}

async function reserveInventory(
  tx: Prisma.TransactionClient,
  items: OrderLine[],
  productMap: Map<string, { id: string; name: string }>
) {
  for (const item of items) {
    const updated = await tx.product.updateMany({
      where: {
        id: item.productId,
        stock: { gte: item.quantity },
      },
      data: {
        stock: { decrement: item.quantity },
      },
    });

    if (updated.count === 0) {
      const product = productMap.get(item.productId)!;
      throw new Error(`Sản phẩm "${product.name}" đã hết hàng`);
    }
  }
}

// GET /api/orders (admin only)
export async function GET(req: NextRequest) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck.error) return adminCheck.error;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const { page, pageSize } = paginationSchema.parse({
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
    });

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }
    if (status) {
      if (!isValidOrderStatus(status)) {
        return errorResponse("Trạng thái đơn hàng không hợp lệ", 400);
      }
      where.status = status;
    }
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        const from = new Date(dateFrom);
        if (Number.isNaN(from.getTime())) {
          return errorResponse("Ngày bắt đầu không hợp lệ", 400);
        }
        (where.createdAt as Record<string, Date>).gte = from;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        if (Number.isNaN(to.getTime())) {
          return errorResponse("Ngày kết thúc không hợp lệ", 400);
        }
        (where.createdAt as Record<string, Date>).lte = to;
      }
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: {
            include: {
              product: { select: { id: true, name: true, image: true, sku: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.order.count({ where }),
    ]);

    return successResponse(orders, undefined, {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return errorResponse("Không thể tải danh sách đơn hàng", 500);
  }
}

// POST /api/orders (admin only)
export async function POST(req: NextRequest) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck.error) return adminCheck.error;

    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return errorResponse(firstError?.message || "Dữ liệu không hợp lệ", 400);
    }

    const { userId, status, note, shippingAddress } = parsed.data;
    const quantityByProductId = new Map<string, number>();
    for (const item of parsed.data.items) {
      quantityByProductId.set(
        item.productId,
        (quantityByProductId.get(item.productId) || 0) + item.quantity
      );
    }
    const items = Array.from(quantityByProductId, ([productId, quantity]) => ({
      productId,
      quantity,
    }));

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return errorResponse("Người dùng không tồn tại", 400);
    }

    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: "active" },
    });

    if (products.length !== productIds.length) {
      return errorResponse("Một số sản phẩm không tồn tại hoặc đã ngừng bán", 400);
    }

    const productMap = new Map(products.map((product) => [product.id, product]));
    for (const item of items) {
      const product = productMap.get(item.productId)!;
      if (product.stock < item.quantity) {
        return errorResponse(
          `Sản phẩm "${product.name}" chỉ còn ${product.stock} trong kho`,
          400
        );
      }
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + productMap.get(item.productId)!.price * item.quantity,
      0
    );

    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
    const uniqueId = uuidv4().slice(0, 6).toUpperCase();
    const orderNumber = `ORD-${dateStr}-${uniqueId}`;

    const order = await prisma.$transaction(async (tx) => {
      if (shouldReserveInventory(status)) {
        await reserveInventory(tx, items, productMap);
      }

      return tx.order.create({
        data: {
          orderNumber,
          userId,
          status,
          totalAmount,
          note: note || null,
          shippingAddress: shippingAddress || null,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: productMap.get(item.productId)!.price,
            })),
          },
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: {
            include: {
              product: { select: { id: true, name: true, image: true } },
            },
          },
        },
      });
    });

    return successResponse(order, "Tạo đơn hàng thành công");
  } catch (error) {
    console.error("Create order error:", error);
    const message = error instanceof Error ? error.message : "Không thể tạo đơn hàng";
    const status = message.includes("hết hàng") ? 400 : 500;
    return errorResponse(message, status);
  }
}
