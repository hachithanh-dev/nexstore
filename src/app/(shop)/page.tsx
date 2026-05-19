import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart, ArrowRight, Sparkles, Truck, ShieldCheck, Headphones,
  Star, Zap, Award, Users, Clock, Laptop, Smartphone, Headphones as HeadphonesIcon,
  Watch, Monitor, Gamepad2, Quote,
} from "lucide-react";
import { CountdownTimer } from "@/components/countdown-timer";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { BrandsMarquee } from "@/components/brands-marquee";
import { AnimatedCounter } from "@/components/animated-counter";

export default async function StorefrontPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { status: "active" },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const allCategories = categories.map((c) => c.category);

  const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    Laptop: <Laptop className="h-7 w-7" />,
    Smartphone: <Smartphone className="h-7 w-7" />,
    Audio: <HeadphonesIcon className="h-7 w-7" />,
    Wearable: <Watch className="h-7 w-7" />,
    Monitor: <Monitor className="h-7 w-7" />,
    Gaming: <Gamepad2 className="h-7 w-7" />,
  };

  const CATEGORY_GRADIENTS = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-500",
    "from-amber-500 to-orange-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-pink-500",
    "from-indigo-500 to-blue-600",
  ];

  return (
    <div className="flex flex-col">
      {/* ========= HERO SECTION ========= */}
      <section className="relative overflow-hidden py-24 lg:py-36">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="orb orb-violet w-[600px] h-[600px] -top-48 left-1/3 animate-float" />
          <div className="orb orb-indigo w-[500px] h-[500px] top-1/3 -right-40 animate-float-delayed" />
          <div className="orb orb-blue w-[400px] h-[400px] bottom-0 -left-32 animate-float-slow" />
          <div className="orb orb-pink w-[350px] h-[350px] -bottom-20 right-1/4 animate-float" />
          {/* Decorative grid pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
        </div>

        <div className="container px-4 mx-auto text-center relative z-10">
          <div className="animate-fade-in">
            <span className="inline-flex items-center rounded-full px-5 py-2 text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-8 backdrop-blur-sm animate-glow-ring">
              <Sparkles className="h-3.5 w-3.5 mr-2" /> Ra mắt bộ sưu tập mới 2026
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight mb-8 animate-slide-up leading-[1.1]" style={{ animationDelay: "0.1s" }}>
            <span className="text-foreground">Công Nghệ Đỉnh Cao</span>
            <br />
            <span className="gradient-text-animated">Trải Nghiệm Vượt Trội</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-12 animate-slide-up leading-relaxed" style={{ animationDelay: "0.2s" }}>
            Khám phá bộ sưu tập sản phẩm công nghệ cao cấp với mức giá tốt nhất.
            Cam kết chính hãng 100% — Giao hàng siêu tốc — Bảo hành toàn diện.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Link href="/products">
              <Button size="lg" className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-8 h-14 w-full sm:w-auto shadow-xl shadow-violet-500/25 animate-pulse-glow btn-glow transition-all duration-300 text-base font-semibold">
                Mua Sắm Ngay <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="rounded-full border-border hover:bg-accent text-foreground px-8 h-14 w-full sm:w-auto transition-all duration-300 text-base">
                Tìm Hiểu Thêm
              </Button>
            </Link>
          </div>

          {/* Animated Stats */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <AnimatedCounter value={10000} suffix="+" label="Khách hàng" />
            <AnimatedCounter value={500} suffix="+" label="Sản phẩm" />
            <AnimatedCounter value={99} suffix="%" label="Hài lòng" />
            <AnimatedCounter value={24} suffix="/7" label="Hỗ trợ" />
          </div>
        </div>
      </section>



      {/* ========= CATEGORIES ========= */}
      <section className="py-20 container px-4 mx-auto">
        <SectionHeader
          badge="Danh mục"
          title="Khám Phá Theo Danh Mục"
          subtitle="Tìm sản phẩm phù hợp với nhu cầu của bạn"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 stagger-children">
          {allCategories.slice(0, 6).map((cat, i) => (
            <Link key={cat} href={`/products?category=${encodeURIComponent(cat)}`}>
              <div className="category-card glass-panel rounded-2xl p-6 flex flex-col items-center gap-3 text-center cursor-pointer group">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${CATEGORY_GRADIENTS[i % CATEGORY_GRADIENTS.length]} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  {CATEGORY_ICONS[cat] || <Sparkles className="h-7 w-7" />}
                </div>
                <span className="font-semibold text-sm text-foreground">{cat}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========= FEATURED PRODUCTS ========= */}
      <section className="py-20 bg-gradient-to-b from-transparent via-accent/30 to-transparent">
        <div className="container px-4 mx-auto">
          <SectionHeader
            badge="Nổi bật"
            title="Sản Phẩm Bán Chạy"
            subtitle="Được yêu thích nhất bởi khách hàng NexStore"
            action={<Link href="/products"><Button variant="outline" className="rounded-full">Xem tất cả <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
            {products.map((product, index) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group">
                <div className="glass-panel bento-card card-hover h-full flex flex-col overflow-hidden rounded-2xl">
                  <div className="relative aspect-square overflow-hidden bg-muted/30 flex items-center justify-center">
                    {product.image ? (
                      <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center">
                        <span className="text-muted-foreground/40">No Image</span>
                      </div>
                    )}
                    {index < 3 && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-[11px] font-semibold text-white shadow-lg">
                        MỚI
                      </div>
                    )}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      <span className="inline-flex items-center gap-2 bg-background/90 dark:bg-background/80 text-foreground text-sm font-medium rounded-full px-4 py-2 shadow-xl backdrop-blur-md border border-border/50">
                        <ShoppingCart className="h-4 w-4" /> Xem Chi Tiết
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "oklch(0.65 0.24 270)" }}>{product.category}</div>
                      <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < 4 ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xl font-bold text-foreground">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========= FLASH SALE ========= */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="orb orb-pink w-[400px] h-[400px] top-0 left-0 animate-float" />
          <div className="orb orb-violet w-[300px] h-[300px] bottom-0 right-0 animate-float-delayed" />
        </div>
        <div className="container px-4 mx-auto relative z-10">
          <div className="glass-panel rounded-3xl p-8 md:p-12 border border-border/50 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 flash-gradient" />
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-500 text-sm font-semibold mb-4">
                  <Zap className="h-4 w-4" /> Flash Sale
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Ưu Đãi Sốc — Giảm Đến 50%
                </h2>
                <p className="text-muted-foreground mb-6 max-w-lg">
                  Chỉ trong thời gian có hạn! Nhanh tay sở hữu những sản phẩm công nghệ hàng đầu với mức giá không tưởng.
                </p>
                <Link href="/products">
                  <Button size="lg" className="rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white px-8 shadow-xl shadow-rose-500/25 transition-all">
                    Mua Ngay <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <CountdownTimer />
            </div>
          </div>
        </div>
      </section>

      {/* ========= WHY CHOOSE US ========= */}
      <section className="py-20 container px-4 mx-auto">
        <SectionHeader
          badge="Cam kết"
          title="Tại Sao Chọn NexStore?"
          subtitle="Hơn 10.000 khách hàng đã tin tưởng và đồng hành"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          <TrustCard icon={<Award className="h-7 w-7" />} title="Chính hãng 100%" desc="Cam kết tất cả sản phẩm đều có nguồn gốc rõ ràng, nhập khẩu chính hãng" gradient="from-amber-500 to-orange-500" />
          <TrustCard icon={<Truck className="h-7 w-7" />} title="Giao siêu tốc" desc="Giao hàng trong 2h tại TP.HCM & HN. Miễn phí ship toàn quốc cho đơn từ 500K" gradient="from-blue-500 to-cyan-500" />
          <TrustCard icon={<ShieldCheck className="h-7 w-7" />} title="Đổi trả dễ dàng" desc="30 ngày đổi trả miễn phí nếu sản phẩm có lỗi. Hoàn tiền 100% nếu không hài lòng" gradient="from-emerald-500 to-teal-500" />
          <TrustCard icon={<Users className="h-7 w-7" />} title="Cộng đồng 10K+" desc="Tham gia cộng đồng NexStore để nhận ưu đãi độc quyền và review sản phẩm mới" gradient="from-violet-500 to-purple-500" />
        </div>
      </section>

      {/* ========= TESTIMONIALS ========= */}
      <section className="py-20 bg-gradient-to-b from-transparent via-accent/20 to-transparent overflow-hidden">
        <div className="container px-4 mx-auto">
          <SectionHeader
            badge="Đánh giá"
            title="Khách Hàng Nói Gì?"
            subtitle="Những phản hồi thực tế từ cộng đồng NexStore"
          />
          <TestimonialCarousel />
        </div>
      </section>

      {/* ========= BRANDS MARQUEE ========= */}
      <section className="py-16 border-y border-border">
        <div className="container px-4 mx-auto mb-8">
          <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest">Đối tác thương hiệu tin cậy</p>
        </div>
        <BrandsMarquee />
      </section>

      {/* ========= CTA SECTION ========= */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="orb orb-violet w-[500px] h-[500px] top-0 left-1/4 animate-float" />
          <div className="orb orb-indigo w-[400px] h-[400px] bottom-0 right-1/4 animate-float-delayed" />
        </div>
        <div className="container px-4 mx-auto text-center relative z-10">
          <div className="glass-panel rounded-3xl p-12 md:p-16 border border-border/50 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Sẵn Sàng <span className="gradient-text">Trải Nghiệm?</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
              Tham gia NexStore ngay hôm nay để nhận ưu đãi giảm 15% cho đơn hàng đầu tiên
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-8 h-13 shadow-xl shadow-violet-500/25 btn-glow transition-all duration-300 text-base font-semibold">
                  Đăng Ký Ngay <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="rounded-full border-border text-foreground px-8 h-13 transition-all">
                  Xem Sản Phẩm
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ========= SUB COMPONENTS ========= */

function SectionHeader({ badge, title, subtitle, action }: { badge: string; title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
      <div>
        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3 uppercase tracking-wider">
          {badge}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground mt-2 max-w-lg">{subtitle}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

function FeatureStrip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-2 text-sm text-muted-foreground">
      <span className="text-primary">{icon}</span>
      <span className="font-medium">{text}</span>
    </div>
  );
}

function TrustCard({ icon, title, desc, gradient }: { icon: React.ReactNode; title: string; desc: string; gradient: string }) {
  return (
    <div className="glass-panel bento-card card-hover p-6 rounded-2xl text-center group">
      <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        {icon}
      </div>
      <h3 className="font-bold text-foreground mb-2 text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
