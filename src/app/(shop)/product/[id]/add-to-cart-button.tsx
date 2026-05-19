"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { useCart, CartItem } from "@/hooks/use-cart";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  product: Omit<CartItem, "quantity">;
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCart((state) => state.addItem);
  const { data: session } = useSession();
  const router = useRouter();

  const handleAdd = () => {
    // Require authentication before adding to cart
    if (!session?.user) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      router.push("/login");
      return;
    }

    addItem({ ...product, quantity });
    setAdded(true);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Quantity Selector */}
      <div className="flex items-center h-12 glass-panel rounded-full border border-border px-2 w-full sm:w-36">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={disabled || quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="flex-1 text-center font-semibold text-foreground tabular-nums">
          {quantity}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
          onClick={() => setQuantity(quantity + 1)}
          disabled={disabled || quantity >= product.stock}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {!disabled && product.stock > 0 && (
        <p className="text-xs text-muted-foreground sm:hidden">
          Tối đa {product.stock} sản phẩm
        </p>
      )}

      {/* Add to Cart CTA */}
      <Button
        size="lg"
        className={`h-12 flex-1 rounded-full font-semibold shadow-xl transition-all duration-500 btn-glow ${
          added
            ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25"
            : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-500/25 animate-pulse-glow"
        } text-white`}
        onClick={handleAdd}
        disabled={disabled}
      >
        {disabled ? (
          "Hết Hàng"
        ) : added ? (
          <>
            <Check className="mr-2 h-5 w-5 animate-bounce-in" /> Đã Thêm!
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" /> Thêm Vào Giỏ Hàng
          </>
        )}
      </Button>
    </div>
  );
}
