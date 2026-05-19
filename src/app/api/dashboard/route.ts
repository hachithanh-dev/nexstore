import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/require-admin";

// GET /api/dashboard (admin only)
export async function GET() {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck.error) return adminCheck.error;

    // Total stats
    const [totalProducts, totalOrders, totalUsers, totalRevenue] =
      await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count(),
        prisma.order.aggregate({
          _sum: { totalAmount: true },
          where: { status: { not: "cancelled" } },
        }),
      ]);

    // Orders by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    // Revenue by month (last 6 months) - simplified for SQLite
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
        status: { not: "cancelled" },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
    });

    // Aggregate by month in JS
    const revenueByMonth: Record<string, number> = {};
    orders.forEach((order) => {
      const month = order.createdAt.toISOString().slice(0, 7); // "YYYY-MM"
      revenueByMonth[month] =
        (revenueByMonth[month] || 0) + order.totalAmount;
    });

    const revenueChart = Object.entries(revenueByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({
        month,
        revenue,
      }));

    // Top products
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      _count: { id: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const topProductDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, price: true, image: true },
        });
        return {
          ...product,
          totalSold: item._sum.quantity || 0,
          orderCount: item._count.id,
        };
      })
    );

    return successResponse({
      overview: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
      },
      ordersByStatus: ordersByStatus.map((item) => ({
        status: item.status,
        count: item._count.id,
      })),
      revenueChart,
      recentOrders,
      topProducts: topProductDetails,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return errorResponse("Không thể tải thống kê bảng điều khiển", 500);
  }
}
