import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";
import { checkoutSchema } from "@/lib/schemas";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse("Vui lòng đăng nhập để đặt hàng", 401);
    }

    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return errorResponse(firstError?.message || "Dữ liệu không hợp lệ", 400);
    }

    const { shippingAddress } = parsed.data;
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

    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!existingUser) {
      return errorResponse(
        "Tài khoản không tồn tại hoặc đã bị xóa. Vui lòng đăng xuất và đăng nhập lại.",
        401
      );
    }

    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: "active" },
    });

    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map((product) => product.id));
      const missing = productIds.filter((id) => !foundIds.has(id));
      return errorResponse(
        `Sản phẩm không tồn tại hoặc đã ngừng bán: ${missing.join(", ")}`,
        400
      );
    }

    const productMap = new Map(products.map((product) => [product.id, product]));
    for (const item of items) {
      const product = productMap.get(item.productId)!;
      if (product.stock < item.quantity) {
        return errorResponse(
          `Sản phẩm "${product.name}" chỉ còn ${product.stock} trong kho (bạn yêu cầu ${item.quantity})`,
          400
        );
      }
    }

    const totalAmount = items.reduce((sum, item) => {
      const product = productMap.get(item.productId)!;
      return sum + product.price * item.quantity;
    }, 0);

    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
    const uniqueId = uuidv4().slice(0, 6).toUpperCase();
    const orderNumber = `ORD-${dateStr}-${uniqueId}`;

    const order = await prisma.$transaction(async (tx) => {
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

      return tx.order.create({
        data: {
          orderNumber,
          userId: session.user!.id!,
          status: "pending",
          totalAmount,
          shippingAddress: shippingAddress.trim(),
          items: {
            create: items.map((item) => {
              const product = productMap.get(item.productId)!;
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
              };
            }),
          },
        },
        include: {
          items: {
            include: {
              product: { select: { id: true, name: true, image: true } },
            },
          },
        },
      });
    });

    return successResponse(order, "Đặt hàng thành công");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Có lỗi xảy ra khi đặt hàng";
    console.error("Checkout error:", error);
    const status = message.includes("hết hàng") ? 400 : 500;
    return errorResponse(message, status);
  }
}
