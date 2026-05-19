"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Menu, Package2, Sun, Moon, Tag, Phone, Info, ChevronDown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/use-cart";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { SearchModal } from "@/components/search-modal";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/products", label: "Sản phẩm" },
  { href: "/about", label: "Về chúng tôi" },
  { href: "/contact", label: "Liên hệ" },
];

export function StoreNavbar() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartItemsCount = useCart((state) => state.getTotalItems());
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut: Ctrl/Cmd + K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.add("theme-transitioning");
    setTheme(theme === "dark" ? "light" : "dark");
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 350);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "glass-panel border-b border-border/50 shadow-lg shadow-black/5 dark:shadow-black/20"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        {/* Top promotional banner */}
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white text-center text-xs py-1.5 font-medium tracking-wide" suppressHydrationWarning>
          <div className="container mx-auto px-4 flex items-center justify-center gap-2" suppressHydrationWarning>
            <Tag className="h-3 w-3" suppressHydrationWarning />
            <span>🎉 Miễn phí vận chuyển cho đơn hàng từ 500.000₫</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Giảm thêm 10% cho thành viên mới</span>
          </div>
        </div>

        <div className="container flex h-16 items-center justify-between mx-auto px-4">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger render={
              <Button variant="ghost" size="icon" className="md:hidden text-foreground/70 hover:text-foreground" suppressHydrationWarning>
                <Menu className="h-5 w-5" suppressHydrationWarning />
              </Button>
            } />
            <SheetContent side="left" className="w-[300px] border-border bg-background/95 backdrop-blur-xl">
              <div className="flex items-center gap-2.5 mt-2 mb-8">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
                  <Package2 className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-foreground">
                  Nex<span className="gradient-text">Store</span>
                </span>
              </div>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive(link.href)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-3 border-t border-border" />
                <Link
                  href="/cart"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-foreground/70 hover:text-foreground hover:bg-accent transition-all"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Giỏ hàng
                  {mounted && cartItemsCount > 0 && (
                    <Badge className="ml-auto h-5 min-w-5 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-0 px-1.5 text-[10px] text-white">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Link>
                {session?.user ? (
                  <Link
                    href={session.user.role === "admin" ? "/dashboard" : "/profile"}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-foreground/70 hover:text-foreground hover:bg-accent transition-all"
                  >
                    <User className="h-5 w-5" />
                    Tài khoản
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 mt-4 px-4 py-3 rounded-xl text-base font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20"
                  >
                    Đăng nhập
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mr-8 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Package2 className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-bold sm:inline-block text-xl tracking-tight text-foreground">
              Nex<span className="gradient-text">Store</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 rounded-lg transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-[18px] w-[18px]" />
              <span className="sr-only">Tìm kiếm</span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
              onClick={toggleTheme}
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-[18px] w-[18px] transition-transform duration-300 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="h-[18px] w-[18px] transition-transform duration-300" />
              )}
              <span className="sr-only">Chuyển theme</span>
            </Button>

            {/* Wishlist — hidden on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Heart className="h-[18px] w-[18px]" />
              <span className="sr-only">Yêu thích</span>
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hover:bg-accent rounded-full">
                <ShoppingCart className="h-5 w-5" />
                {mounted && cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-0 text-[10px] text-white border-2 border-background animate-bounce-in">
                    {cartItemsCount}
                  </Badge>
                )}
                <span className="sr-only">Giỏ hàng</span>
              </Button>
            </Link>

            {/* User */}
            {session?.user ? (
              <Link href={session.user.role === "admin" ? "/dashboard" : "/profile"}>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Tài khoản</span>
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white h-9 px-5 shadow-lg shadow-violet-500/20 transition-all duration-300 hover:shadow-violet-500/30 hidden sm:flex">
                  Đăng nhập
                </Button>
                <Button variant="ghost" size="icon" className="sm:hidden text-muted-foreground hover:text-foreground">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
