import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/require-admin";
import { updateOrderSchema } from "@/lib/schemas";
import type { Prisma } from "@prisma/client";

type OrderInventoryItem = {
  productId: string;
  quantity: number;
};

function shouldReserveInventory(status: string) {
  return status !== "cancelled";
}

async function releaseInventory(
  tx: Prisma.TransactionClient,
  items: OrderInventoryItem[]
) {
  for (const item of items) {
    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });
  }
}

async function reserveInventory(
  tx: Prisma.TransactionClient,
  items: OrderInventoryItem[],
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
      const product = productMap.get(item.productId);
      throw new Error(
        `Sản phẩm "${product?.name || item.productId}" không còn đủ tồn kho`
      );
    }
  }
}

// GET /api/orders/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck.error) return adminCheck.error;

    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, address: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, image: true, sku: true, price: true } },
          },
        },
      },
    });

    if (!order) return errorResponse("Không tìm thấy đơn hàng", 404);
    return successResponse(order);
  } catch (error) {
    console.error("Get order error:", error);
    return errorResponse("Không thể tải đơn hàng", 500);
  }
}

// PUT /api/orders/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck.error) return adminCheck.error;

    const { id } = await params;
    const body = await req.json();
    const parsed = updateOrderSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return errorResponse(firstError?.message || "Dữ liệu không hợp lệ", 400);
    }

    const existing = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          select: {
            productId: true,
            quantity: true,
            product: { select: { id: true, name: true } },
          },
        },
      },
    });
    if (!existing) return errorResponse("Không tìm thấy đơn hàng", 404);

    const nextStatus = parsed.data.status ?? existing.status;
    const items = existing.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
    const productMap = new Map(
      existing.items.map((item) => [
        item.productId,
        { id: item.product.id, name: item.product.name },
      ])
    );

    const order = await prisma.$transaction(async (tx) => {
      if (
        existing.status !== nextStatus &&
        shouldReserveInventory(existing.status) !==
          shouldReserveInventory(nextStatus)
      ) {
        if (shouldReserveInventory(nextStatus)) {
          await reserveInventory(tx, items, productMap);
        } else {
          await releaseInventory(tx, items);
        }
      }

      return tx.order.update({
        where: { id },
        data: parsed.data,
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

    return successResponse(order, "Cập nhật đơn hàng thành công");
  } catch (error) {
    console.error("Update order error:", error);
    const message =
      error instanceof Error ? error.message : "Không thể cập nhật đơn hàng";
    const status = message.includes("tồn kho") ? 400 : 500;
    return errorResponse(message, status);
  }
}

// DELETE /api/orders/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck.error) return adminCheck.error;

    const { id } = await params;
    const existing = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          select: {
            productId: true,
            quantity: true,
          },
        },
      },
    });
    if (!existing) return errorResponse("Không tìm thấy đơn hàng", 404);

    await prisma.$transaction(async (tx) => {
      if (shouldReserveInventory(existing.status)) {
        await releaseInventory(tx, existing.items);
      }

      await tx.order.delete({ where: { id } });
    });
    return successResponse(null, "Xóa đơn hàng thành công");
  } catch (error) {
    console.error("Delete order error:", error);
    return errorResponse("Không thể xóa đơn hàng", 500);
  }
}
