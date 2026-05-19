import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, SlidersHorizontal } from "lucide-react";
import { ProductFilters } from "./product-filters";

interface SearchParams {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
}

const ALLOWED_SORT_FIELDS = ["createdAt", "name", "price", "stock"] as const;
const PAGE_SIZE = 12;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category || "";
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const sortBy = ALLOWED_SORT_FIELDS.includes(params.sortBy as typeof ALLOWED_SORT_FIELDS[number])
    ? params.sortBy!
    : "createdAt";
  const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";
  const page = Math.max(1, parseInt(params.page || "1") || 1);

  // Build where clause
  const where: Record<string, unknown> = { status: "active" };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }
  if (category) where.category = category;
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined && !isNaN(minPrice))
      (where.price as Record<string, number>).gte = minPrice;
    if (maxPrice !== undefined && !isNaN(maxPrice))
      (where.price as Record<string, number>).lte = maxPrice;
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where: { status: "active" },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const allCategories = categories.map((c) => c.category);

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {search ? `Kết quả tìm kiếm: "${search}"` : "Tất Cả Sản Phẩm"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {total} sản phẩm {category ? `trong danh mục "${category}"` : ""}
        </p>
      </div>

      {/* Filters */}
      <ProductFilters
        categories={allCategories}
        currentCategory={category}
        currentSort={sortBy}
        currentOrder={sortOrder}
        currentSearch={search}
      />

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-muted/50 dark:bg-white/5 mx-auto flex items-center justify-center mb-4">
            <SlidersHorizontal className="w-10 h-10 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Không tìm thấy sản phẩm
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
          </p>
          <Link href="/products">
            <Button variant="outline" className="rounded-full">
              Xóa bộ lọc
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="group">
              <div className="glass-panel bento-card card-hover h-full flex flex-col overflow-hidden rounded-2xl">
                <div className="relative aspect-square overflow-hidden bg-muted/30 flex items-center justify-center">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center">
                      <span className="text-muted-foreground/40">No Image</span>
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
                    <div
                      className="text-xs font-semibold tracking-wider uppercase mb-2"
                      style={{ color: "oklch(0.65 0.24 270)" }}
                    >
                      {product.category}
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < 4 ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xl font-bold text-foreground">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.price)}
                    </span>
                    {product.stock <= 0 && (
                      <span className="text-xs text-rose-500 font-medium">Hết hàng</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {page > 1 && (
            <Link
              href={{
                pathname: "/products",
                query: { ...params, page: String(page - 1) },
              }}
            >
              <Button variant="outline" size="sm" className="rounded-full">
                Trang trước
              </Button>
            </Link>
          )}
          <span className="text-sm text-muted-foreground px-4">
            Trang {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={{
                pathname: "/products",
                query: { ...params, page: String(page + 1) },
              }}
            >
              <Button variant="outline" size="sm" className="rounded-full">
                Trang sau
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
