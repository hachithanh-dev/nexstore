"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";

const navItems = [
  {
    title: "Tổng Quan",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Sản Phẩm",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Đơn Hàng",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Người Dùng",
    href: "/dashboard/users",
    icon: Users,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-64" : "w-[72px]"
      )}
    >
      {/* Logo area */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {sidebarOpen && (
            <span className="text-lg font-bold tracking-tight text-white">
              NexStore
            </span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-violet-500/20 to-indigo-500/10 text-white shadow-sm"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-violet-400 to-indigo-500" />
              )}
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive
                    ? "text-violet-400"
                    : "text-slate-500 group-hover:text-slate-300"
                )}
              />
              {sidebarOpen && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {sidebarOpen && (
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="rounded-xl border border-white/5 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 p-4">
            <p className="text-xs font-medium text-slate-300">NexStore v1.0</p>
            <p className="mt-1 text-xs text-slate-500">
              Quản lý cửa hàng
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
