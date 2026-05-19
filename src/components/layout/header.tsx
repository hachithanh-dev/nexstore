"use client";

import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useAppStore } from "@/store/use-app-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  User,
  Bell,
  ExternalLink,
  Store,
} from "lucide-react";
import Link from "next/link";
import { getInitials } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-background/80 px-6 backdrop-blur-xl transition-all duration-300",
        sidebarOpen ? "ml-64" : "ml-[72px]"
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">
            Chào mừng trở lại
          </h2>
          <p className="text-base font-semibold text-foreground">
            {session?.user?.name || "Người dùng"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
          suppressHydrationWarning
        >
          {mounted ? (
            theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />
          ) : (
            <Moon className="h-[18px] w-[18px]" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-accent hover:text-foreground">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent">
              <Avatar className="h-8 w-8 border border-white/10">
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
                  {getInitials(session?.user?.name || "U")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-foreground">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  <Badge
                    variant="outline"
                    className="h-4 px-1.5 text-[10px] font-medium"
                  >
                    {session?.user?.role === "admin" ? "Quản trị viên" : "Người dùng"}
                  </Badge>
                </p>
              </div>
            </button>
          } />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{session?.user?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/profile" />}>
              <User className="mr-2 h-4 w-4" />
              Hồ sơ
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/" />}>
              <Store className="mr-2 h-4 w-4" />
              Quay về trang web
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-red-500 focus:text-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
