import { formatCurrency } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";

interface TopProduct {
  name: string;
  price: number;
  image: string | null;
  totalSold: number;
  orderCount: number;
}

interface TopProductsTableProps {
  products: TopProduct[];
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        Chưa có dữ liệu sản phẩm
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-lg border border-white/5 p-3 transition-colors hover:bg-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-sm font-bold text-violet-400">
              #{index + 1}
            </div>
            <div>
              <p className="text-sm font-medium">{product.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(product.price)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="text-xs">
              Đã bán {product.totalSold}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
