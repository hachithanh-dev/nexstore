import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export interface CartItem {
  id: string; // Product ID
  name: string;
  price: number;
  image: string | null;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);

        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
          toast.success("Đã cập nhật số lượng trong giỏ hàng");
        } else {
          set({ items: [...currentItems, item] });
          toast.success("Đã thêm vào giỏ hàng");
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
        toast.info("Đã xóa khỏi giỏ hàng");
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: "nexstore-cart",
    }
  )
);
