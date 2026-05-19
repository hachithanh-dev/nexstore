"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CreditCard, Truck, ShieldCheck, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push("/cart");
    }
  }, [mounted, items.length, router]);

  if (!mounted || items.length === 0) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error("Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
          shippingAddress: address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Có lỗi xảy ra khi đặt hàng");
      }

      toast.success("Đặt hàng thành công! 🎉");
      clearCart();
      router.push("/profile");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Có lỗi xảy ra khi đặt hàng";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-fade-in">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <StepIndicator step={1} label="Giỏ hàng" completed />
        <div className="w-12 h-px bg-primary/50" />
        <StepIndicator step={2} label="Thanh toán" active />
        <div className="w-12 h-px bg-border" />
        <StepIndicator step={3} label="Hoàn tất" />
      </div>

      <div className="flex items-center gap-4 mb-8">
        <Link href="/cart"><Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <h1 className="text-3xl font-bold text-foreground">Thanh Toán</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div className="space-y-6 animate-slide-left">
          <div className="glass-panel bento-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mr-3 shadow-lg shadow-violet-500/20">
                <Truck className="h-4 w-4 text-white" />
              </div>
              Thông tin giao hàng
            </h2>
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Địa chỉ chi tiết</label>
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-28 rounded-xl border border-border bg-background/50 p-4 text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] transition-all outline-none resize-none text-sm"
                  placeholder="Nhập số nhà, tên đường, quận/huyện, tỉnh/thành phố..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phương thức thanh toán</label>
                <div className="p-4 rounded-xl border-2 border-primary/50 bg-primary/5 flex items-center justify-between transition-all">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="text-foreground font-medium text-sm">Thanh toán khi nhận hàng (COD)</span>
                      <p className="text-xs text-muted-foreground">An toàn & tiện lợi</p>
                    </div>
                  </div>
                  <div className="h-5 w-5 rounded-full border-[3px] border-primary bg-primary/20 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="animate-slide-right">
          <div className="glass-panel bento-card p-6 sticky top-24 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-5">Đơn hàng của bạn</h2>

            <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 group">
                  <div className="relative w-14 h-14 rounded-lg bg-muted/30 dark:bg-slate-800/50 overflow-hidden flex-shrink-0">
                    {item.image && <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />}
                  </div>
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">{item.name}</h4>
                    <div className="flex justify-between mt-0.5 text-sm">
                      <span className="text-muted-foreground">×{item.quantity}</span>
                      <span className="text-primary font-semibold">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Tạm tính ({items.reduce((a, b) => a + b.quantity, 0)} sp)</span>
                <span className="text-foreground font-medium">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Phí vận chuyển</span>
                <span className="text-emerald-500 font-medium">Miễn phí</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between items-center">
                <span className="text-base font-semibold text-foreground">Tổng cộng</span>
                <span className="text-2xl font-bold gradient-text">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(getTotalPrice())}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full h-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-xl shadow-violet-500/20 btn-glow transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...
                </>
              ) : (
                <>
                  Xác Nhận Đặt Hàng <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="mt-4 flex items-center justify-center text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 mr-1.5 text-emerald-500" /> Thanh toán an toàn & bảo mật
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ step, label, active, completed }: { step: number; label: string; active?: boolean; completed?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
        active
          ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30"
          : completed
          ? "bg-primary/20 text-primary border-2 border-primary/50"
          : "bg-muted/50 dark:bg-white/5 text-muted-foreground"
      }`}>
        {completed ? "✓" : step}
      </div>
      <span className={`text-sm font-medium hidden sm:inline ${active ? "text-foreground" : completed ? "text-primary" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  );
}
