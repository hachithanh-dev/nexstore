"use client";

import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatShortDate } from "@/utils/formatters";
import { RevenueChart } from "@/features/dashboard/revenue-chart";
import { OrderStatusChart } from "@/features/dashboard/order-status-chart";
import { TopProductsTable } from "@/features/dashboard/top-products-table";

const orderStatusLabels: Record<string, string> = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      return json.data;
    },
  });

  const stats = [
    {
      title: "Tổng Doanh Thu",
      value: data?.overview?.totalRevenue
        ? formatCurrency(data.overview.totalRevenue)
        : "₫0",
      icon: DollarSign,
      change: "+12.5%",
      gradient: "from-emerald-500 to-teal-600",
      bgGlow: "bg-emerald-500/10",
    },
    {
      title: "Tổng Đơn Hàng",
      value: data?.overview?.totalOrders || 0,
      icon: ShoppingCart,
      change: "+8.2%",
      gradient: "from-violet-500 to-indigo-600",
      bgGlow: "bg-violet-500/10",
    },
    {
      title: "Tổng Sản Phẩm",
      value: data?.overview?.totalProducts || 0,
      icon: Package,
      change: "+3.1%",
      gradient: "from-amber-500 to-orange-600",
      bgGlow: "bg-amber-500/10",
    },
    {
      title: "Tổng Người Dùng",
      value: data?.overview?.totalUsers || 0,
      icon: Users,
      change: "+18.7%",
      gradient: "from-pink-500 to-rose-600",
      bgGlow: "bg-pink-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bảng Điều Khiển</h1>
        <p className="text-muted-foreground">
          Tổng quan hiệu suất cửa hàng
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass-panel bento-card card-hover">
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold tracking-tight">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                      <span className="text-muted-foreground">so với tháng trước</span>
                    </div>
                  </div>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                  >
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-5 lg:grid-cols-7">
        {/* Revenue Chart - takes 4 cols */}
        <Card className="lg:col-span-4 glass-panel bento-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-200">
              <TrendingUp className="h-5 w-5 text-violet-400" />
              Tổng Quan Doanh Thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <RevenueChart data={data?.revenueChart || []} />
            )}
          </CardContent>
        </Card>

        {/* Order Status Chart - takes 3 cols */}
        <Card className="lg:col-span-3 glass-panel bento-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-200">
              <ShoppingCart className="h-5 w-5 text-indigo-400" />
              Đơn Hàng Theo Trạng Thái
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <OrderStatusChart data={data?.ordersByStatus || []} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-5 lg:grid-cols-7">
        {/* Top Products */}
        <Card className="lg:col-span-4 glass-panel bento-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-200">
              <Package className="h-5 w-5 text-amber-400" />
              Sản Phẩm Bán Chạy
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <TopProductsTable products={data?.topProducts || []} />
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="lg:col-span-3 glass-panel bento-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-200">
              <ShoppingCart className="h-5 w-5 text-emerald-400" />
              Đơn Hàng Gần Đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {data?.recentOrders?.map(
                  (order: {
                    id: string;
                    orderNumber: string;
                    totalAmount: number;
                    status: string;
                    createdAt: string;
                    user: { name: string };
                  }) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-lg border border-white/5 p-3 transition-colors hover:bg-white/5"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.user.name} •{" "}
                          {formatShortDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <Badge
                          variant="outline"
                          className="mt-1 text-[10px]"
                        >
                          {orderStatusLabels[order.status] || order.status}
                        </Badge>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
