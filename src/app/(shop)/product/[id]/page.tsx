import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Check, ShieldCheck, Truck, Package, Star, RotateCcw } from "lucide-react";
import Link from "next/link";
import { AddToCartButton } from "./add-to-cart-button";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product || product.status !== "active") {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Trang chủ</Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Image */}
        <div className="animate-slide-left">
          <div className="glass-panel bento-card rounded-2xl p-2 sm:p-4 aspect-square bg-muted/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-xl transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Package className="h-20 w-20 mb-4 opacity-50" />
                <span>Chưa có hình ảnh</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col animate-slide-right">
          {/* Category */}
          <div className="mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">4.0 (128 đánh giá)</span>
          </div>

          {/* Price & Stock */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-extrabold gradient-text">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
            </span>
            {product.stock > 0 ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Check className="w-3 h-3 mr-1" /> Còn hàng ({product.stock})
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                Hết hàng
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-base leading-relaxed mb-10 pb-8 border-b border-border">
            {product.description || "Chưa có mô tả cho sản phẩm này."}
          </p>

          {/* Features */}
          <div className="mb-10 space-y-4 stagger-children">
            <FeatureItem
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Bảo hành chính hãng 12 tháng"
              subtitle="Cam kết 100% hàng chuẩn"
              color="text-violet-500"
            />
            <FeatureItem
              icon={<Truck className="h-5 w-5" />}
              title="Miễn phí vận chuyển toàn quốc"
              subtitle="Giao hàng hỏa tốc trong 2h tại TP.HCM & HN"
              color="text-blue-500"
            />
            <FeatureItem
              icon={<RotateCcw className="h-5 w-5" />}
              title="Đổi trả miễn phí trong 30 ngày"
              subtitle="Hoàn tiền 100% nếu không hài lòng"
              color="text-amber-500"
            />
          </div>

          {/* Add to Cart */}
          <div className="mt-auto">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              }}
              disabled={product.stock <= 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
}) {
  return (
    <div className="flex items-center text-foreground group">
      <div className={`w-10 h-10 rounded-full bg-muted/50 dark:bg-white/5 flex items-center justify-center mr-4 transition-colors group-hover:bg-primary/10 ${color}`}>
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-foreground text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
