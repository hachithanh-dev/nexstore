import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Package, MapPin, Phone, CheckCircle2, Clock, Truck, ShoppingBag, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4 text-amber-500" />;
      case "processing": return <Package className="h-4 w-4 text-blue-500" />;
      case "shipped": return <Truck className="h-4 w-4 text-indigo-500" />;
      case "delivered": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Chờ xử lý";
      case "processing": return "Đang đóng gói";
      case "shipped": return "Đang giao hàng";
      case "delivered": return "Đã giao thành công";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "processing": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "shipped": return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      case "delivered": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      default: return "bg-muted/50 text-muted-foreground border-border";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl animate-fade-in">
      <div className="grid md:grid-cols-3 gap-8">

        {/* User Sidebar */}
        <div className="md:col-span-1 space-y-6 animate-slide-left">
          {/* Profile Card */}
          <div className="glass-panel bento-card p-6 text-center rounded-2xl">
            {/* Avatar with gradient ring */}
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500 p-[3px] animate-spin-slow">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-3xl font-bold text-primary uppercase">
                  {user.name?.[0] || user.email?.[0]}
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
            <p className="text-muted-foreground text-sm">{user.email}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="glass-panel rounded-xl p-3 text-center">
                <ShoppingBag className="h-5 w-5 mx-auto text-primary mb-1" />
                <div className="text-lg font-bold text-foreground">{orders.length}</div>
                <div className="text-[11px] text-muted-foreground">Đơn hàng</div>
              </div>
              <div className="glass-panel rounded-xl p-3 text-center">
                <CreditCard className="h-5 w-5 mx-auto text-primary mb-1" />
                <div className="text-lg font-bold text-foreground">{new Intl.NumberFormat("vi-VN", { notation: "compact" }).format(totalSpent)}</div>
                <div className="text-[11px] text-muted-foreground">Đã chi</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 text-left border-t border-border pt-5 mt-5">
              <div className="flex items-center text-muted-foreground">
                <Phone className="w-4 h-4 mr-3 text-primary/60" />
                <span className="text-sm">{user.phone || "Chưa cập nhật SĐT"}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-4 h-4 mr-3 text-primary/60" />
                <span className="text-sm">{user.address || "Chưa cập nhật địa chỉ"}</span>
              </div>
            </div>

            {/* Logout */}
            <div className="mt-6 pt-5 border-t border-border">
              <LogoutButton />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="md:col-span-2 animate-slide-right">
          <h2 className="text-2xl font-bold text-foreground mb-6">Lịch sử đơn hàng</h2>

          {orders.length === 0 ? (
            <div className="glass-panel bento-card p-12 text-center rounded-2xl animate-scale-in">
              <div className="w-20 h-20 rounded-full bg-muted/50 dark:bg-white/5 mx-auto flex items-center justify-center mb-4 animate-float">
                <Package className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Chưa có đơn hàng nào</h3>
              <p className="text-muted-foreground text-sm mb-6">Bạn chưa đặt mua sản phẩm nào. Hãy khám phá cửa hàng nhé!</p>
              <Link href="/">
                <Button className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20">Mua sắm ngay</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-5 stagger-children">
              {orders.map((order) => (
                <div key={order.id} className="glass-panel bento-card overflow-hidden rounded-2xl">
                  {/* Order Header */}
                  <div className="bg-muted/30 dark:bg-white/5 px-5 py-4 border-b border-border flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground">Mã đơn hàng</span>
                      <p className="font-mono text-foreground font-semibold text-sm">{order.orderNumber}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Ngày đặt</span>
                      <p className="text-foreground text-sm">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                    </div>
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                      <span className="mr-1.5">{getStatusIcon(order.status)}</span>
                      {getStatusText(order.status)}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-5">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4 group">
                          <div className="relative w-14 h-14 rounded-lg bg-muted/30 dark:bg-slate-800/50 overflow-hidden flex-shrink-0">
                            {item.product.image ? (
                              <Image src={item.product.image} alt={item.product.name} fill sizes="56px" className="object-cover transition-transform duration-300 group-hover:scale-110" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-muted-foreground/40" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link href={`/product/${item.product.id}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate block">
                              {item.product.name}
                            </Link>
                            <div className="text-xs text-muted-foreground mt-0.5">Số lượng: {item.quantity}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-foreground">
                              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="bg-muted/30 dark:bg-white/5 px-5 py-3 border-t border-border flex justify-between items-center">
                    <span className="text-muted-foreground text-sm font-medium">Tổng tiền</span>
                    <span className="text-lg font-bold gradient-text">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.totalAmount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
