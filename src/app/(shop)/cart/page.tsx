"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart, syncInventory } = useCart();
  const [mounted, setMounted] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const inventoryKey = items.map((item) => item.id).sort().join(",");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || items.length === 0) return;

    const syncCartInventory = async () => {
      setSyncing(true);
      try {
        const params = new URLSearchParams({
          ids: items.map((item) => item.id).join(","),
          pageSize: String(items.length),
        });
        const res = await fetch(`/api/products?${params.toString()}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "Không thể đồng bộ tồn kho");
        }

        const products = Array.isArray(json.data) ? json.data : [];
        syncInventory(
          items.map((item) => {
            const product = products.find((p: { id: string; stock: number }) => p.id === item.id);
            return {
              id: item.id,
              stock: product?.stock ?? 0,
            };
          })
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Không thể đồng bộ tồn kho";
        toast.error(message);
      } finally {
        setSyncing(false);
      }
    };

    void syncCartInventory();
  }, [inventoryKey, mounted, syncInventory]);

  if (!mounted) return null;

  const hasUnavailableItems = items.some((item) => item.stock <= 0);
  const getStockMessage = (item: { stock?: number; quantity: number }) => {
    if (typeof item.stock !== "number") {
      return { text: "Đang kiểm tra tồn kho...", className: "text-muted-foreground" };
    }
    if (item.stock <= 0) {
      return { text: "Sản phẩm hiện đã hết hàng", className: "text-rose-500" };
    }
    if (item.quantity >= item.stock) {
      return {
        text: `Bạn đang lấy tối đa tồn kho hiện có: ${item.stock}`,
        className: "text-amber-500",
      };
    }
    return {
      text: `Còn lại ${item.stock} sản phẩm trong kho`,
      className: "text-muted-foreground",
    };
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] animate-scale-in">
        <div className="w-28 h-28 rounded-full bg-muted/50 dark:bg-white/5 flex items-center justify-center mb-8 animate-float">
          <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Giỏ hàng của bạn đang trống</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi.
        </p>
        <Link href="/">
          <Button className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-8 h-12 shadow-lg shadow-violet-500/20 btn-glow">
            <ArrowLeft className="mr-2 h-4 w-4" /> Tiếp tục mua sắm
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <StepIndicator step={1} label="Giỏ hàng" active />
        <div className="w-12 h-px bg-border" />
        <StepIndicator step={2} label="Thanh toán" />
        <div className="w-12 h-px bg-border" />
        <StepIndicator step={3} label="Hoàn tất" />
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-8">Giỏ Hàng ({items.reduce((a, b) => a + b.quantity, 0)} sản phẩm)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4 stagger-children">
          {items.map((item) => {
            const stockMessage = getStockMessage(item);
            return (
              <div key={item.id} className="glass-panel bento-card p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-5 rounded-2xl group">
                {/* Image */}
                <div className="relative w-24 h-24 shrink-0 rounded-xl bg-muted/30 dark:bg-slate-800/50 overflow-hidden flex items-center justify-center">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <Package className="h-8 w-8 text-muted-foreground/40" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <Link href={`/product/${item.id}`} className="text-base font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 mb-1">
                    {item.name}
                  </Link>
                  <div className="text-primary font-bold">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)}
                  </div>
                  <p className={`mt-1 text-xs font-medium ${stockMessage.className}`}>
                    {stockMessage.text}
                  </p>
                </div>

                {/* Quantity + Actions */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center h-10 glass-panel rounded-full border border-border px-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-semibold text-foreground text-sm tabular-nums">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={typeof item.stock === "number" && item.stock <= item.quantity}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between items-center pt-2">
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" /> Tiếp tục mua sắm
              </Button>
            </Link>
            <Button variant="ghost" className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10" onClick={clearCart}>
              <Trash2 className="mr-2 h-4 w-4" /> Xóa tất cả
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-panel bento-card p-6 sticky top-24 rounded-2xl animate-slide-right">
            <h3 className="text-xl font-semibold text-foreground mb-6">Tổng Đơn Hàng</h3>
            {syncing && (
              <p className="mb-4 text-xs text-muted-foreground">
                Đang đồng bộ tồn kho mới nhất...
              </p>
            )}
            {hasUnavailableItems && (
              <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-500">
                Có sản phẩm đã hết hàng trong giỏ. Vui lòng xóa hoặc giảm số lượng trước khi thanh toán.
              </div>
            )}

            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Tạm tính</span>
                <span className="text-foreground font-medium">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Phí vận chuyển</span>
                <span className="text-emerald-500 font-medium">Miễn phí</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="text-base font-semibold text-foreground">Tổng cộng</span>
                <span className="text-2xl font-bold gradient-text">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(getTotalPrice())}
                </span>
              </div>
            </div>

            <Link href="/checkout">
              <Button
                disabled={hasUnavailableItems || syncing}
                className="w-full h-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-xl shadow-violet-500/20 btn-glow transition-all disabled:cursor-not-allowed disabled:opacity-60"
              >
                Thanh Toán <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ step, label, active }: { step: number; label: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
        active
          ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30"
          : "bg-muted/50 dark:bg-white/5 text-muted-foreground"
      }`}>
        {step}
      </div>
      <span className={`text-sm font-medium hidden sm:inline ${active ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  );
}
