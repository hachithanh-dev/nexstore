import { StoreNavbar } from "@/components/store-navbar";
import { NewsletterForm } from "@/components/newsletter-form";
import Link from "next/link";
import { Package2, Globe, MessageCircle, Play, Mail, MapPin, Phone, CreditCard, Wallet, Banknote } from "lucide-react";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-mesh text-foreground">
      <StoreNavbar />
      <main className="flex-1">
        {children}
      </main>

      {/* Premium Footer */}
      <footer className="relative mt-16 border-t border-border gradient-border">
        <div className="bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* Brand Column */}
              <div className="space-y-4">
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
                    <Package2 className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-xl tracking-tight text-foreground">
                    Nex<span className="gradient-text">Store</span>
                  </span>
                </Link>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                  Nền tảng mua sắm công nghệ hàng đầu Việt Nam. Cam kết chính hãng 100%, giá tốt nhất thị trường.
                </p>
                {/* Social Links */}
                <div className="flex items-center gap-3 pt-2">
                  {[
                    { icon: <Globe className="h-4 w-4" />, label: "Website" },
                    { icon: <MessageCircle className="h-4 w-4" />, label: "Chat" },
                    { icon: <Play className="h-4 w-4" />, label: "Video" },
                  ].map((s) => (
                    <button key={s.label} className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent hover:border-primary/30 transition-all" aria-label={s.label}>
                      {s.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Liên kết nhanh</h4>
                <nav className="flex flex-col gap-2.5 text-sm">
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors w-fit">Trang chủ</Link>
                  <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors w-fit">Sản phẩm</Link>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors w-fit">Về chúng tôi</Link>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors w-fit">Liên hệ</Link>
                  <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors w-fit">Giỏ hàng</Link>
                </nav>
              </div>

              {/* Customer Support */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Hỗ trợ khách hàng</h4>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>1900 6868 (miễn phí)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>support@nexstore.vn</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>123 Nguyễn Huệ, Q.1, TP.HCM</span>
                  </div>
                </div>
              </div>

              {/* Newsletter + Payment */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Nhận ưu đãi</h4>
                <p className="text-muted-foreground text-sm">Đăng ký nhận khuyến mãi & sản phẩm mới.</p>
                <NewsletterForm />
                <div className="pt-3">
                  <p className="text-xs text-muted-foreground mb-2">Phương thức thanh toán</p>
                  <div className="flex items-center gap-2">
                    {[
                      { icon: <CreditCard className="h-4 w-4" />, label: "Visa" },
                      { icon: <CreditCard className="h-4 w-4" />, label: "Master" },
                      { icon: <Wallet className="h-4 w-4" />, label: "MoMo" },
                      { icon: <Banknote className="h-4 w-4" />, label: "COD" },
                    ].map((p) => (
                      <div key={p.label} className="h-8 px-2.5 rounded-lg border border-border flex items-center justify-center text-muted-foreground/60 text-[10px] font-medium gap-1">
                        {p.icon}
                        {p.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} NexStore. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <Link href="#" className="hover:text-foreground transition-colors">Điều khoản</Link>
                <Link href="#" className="hover:text-foreground transition-colors">Chính sách bảo mật</Link>
                <Link href="#" className="hover:text-foreground transition-colors">Chính sách đổi trả</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
