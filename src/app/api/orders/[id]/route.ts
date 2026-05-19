import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/require-admin";
import { updateOrderSchema } from "@/lib/schemas";

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

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) return errorResponse("Không tìm thấy đơn hàng", 404);

    const order = await prisma.order.update({
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

    return successResponse(order, "Cập nhật đơn hàng thành công");
  } catch (error) {
    console.error("Update order error:", error);
    return errorResponse("Không thể cập nhật đơn hàng", 500);
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
    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) return errorResponse("Không tìm thấy đơn hàng", 404);

    await prisma.order.delete({ where: { id } });
    return successResponse(null, "Xóa đơn hàng thành công");
  } catch (error) {
    console.error("Delete order error:", error);
    return errorResponse("Không thể xóa đơn hàng", 500);
  }
}
