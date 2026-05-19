import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/require-admin";
import { updateProductSchema } from "@/lib/schemas";

// GET /api/products/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product || (product.status !== "active" && !isAdmin)) {
      return errorResponse("Không tìm thấy sản phẩm", 404);
    }

    return successResponse(product);
  } catch (error) {
    console.error("Get product error:", error);
    return errorResponse("Không thể tải sản phẩm", 500);
  }
}

// PUT /api/products/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck.error) return adminCheck.error;

    const { id } = await params;
    const body = await req.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return errorResponse(firstError?.message || "Dữ liệu không hợp lệ", 400);
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return errorResponse("Không tìm thấy sản phẩm", 404);

    // Check SKU uniqueness if changed
    if (parsed.data.sku && parsed.data.sku !== existing.sku) {
      const skuExists = await prisma.product.findUnique({ where: { sku: parsed.data.sku } });
      if (skuExists) return errorResponse("SKU đã tồn tại", 409);
    }

    const product = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });

    return successResponse(product, "Cập nhật sản phẩm thành công");
  } catch (error) {
    console.error("Update product error:", error);
    return errorResponse("Không thể cập nhật sản phẩm", 500);
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck.error) return adminCheck.error;

    const { id } = await params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return errorResponse("Không tìm thấy sản phẩm", 404);

    await prisma.product.delete({ where: { id } });
    return successResponse(null, "Xóa sản phẩm thành công");
  } catch (error) {
    console.error("Delete product error:", error);
    return errorResponse("Không thể xóa sản phẩm", 500);
  }
}
