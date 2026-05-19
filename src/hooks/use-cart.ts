import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

function hasKnownStock(stock: number | undefined): stock is number {
  return Number.isFinite(stock);
}

export interface CartItem {
  id: string; // Product ID
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  stock: number;
}

interface InventorySnapshot {
  id: string;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  syncInventory: (inventory: InventorySnapshot[]) => void;
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
        const maxStock = Math.max(0, item.stock);

        if (maxStock <= 0) {
          toast.error(`Sản phẩm "${item.name}" đã hết hàng`);
          return;
        }

        if (existingItem) {
          const nextQuantity = Math.min(
            existingItem.quantity + item.quantity,
            maxStock
          );

          if (nextQuantity === existingItem.quantity) {
            toast.error(`Sản phẩm "${item.name}" chỉ còn ${maxStock} trong kho`);
            return;
          }

          set({
            items: currentItems.map((i) =>
              i.id === item.id
                ? { ...i, stock: maxStock, quantity: nextQuantity }
                : i
            ),
          });
          toast.success(
            nextQuantity < existingItem.quantity + item.quantity
              ? `Đã cập nhật giỏ hàng, tối đa còn ${maxStock} sản phẩm`
              : "Đã cập nhật số lượng trong giỏ hàng"
          );
        } else {
          const quantity = Math.min(item.quantity, maxStock);
          set({ items: [...currentItems, { ...item, quantity, stock: maxStock }] });
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
        const currentItem = get().items.find((i) => i.id === id);
        if (!currentItem) return;

        if (hasKnownStock(currentItem.stock) && currentItem.stock <= 0) {
          toast.error(`Sản phẩm "${currentItem.name}" đã hết hàng`);
          return;
        }

        const availableStock = hasKnownStock(currentItem.stock)
          ? currentItem.stock
          : Number.MAX_SAFE_INTEGER;
        const nextQuantity = Math.min(quantity, availableStock);
        if (hasKnownStock(currentItem.stock) && nextQuantity < quantity) {
          toast.error(
            `Sản phẩm "${currentItem.name}" chỉ còn ${currentItem.stock} trong kho`
          );
        }

        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: nextQuantity } : i
          ),
        });
      },
      syncInventory: (inventory) => {
        const inventoryMap = new Map(inventory.map((item) => [item.id, item.stock]));
        const messages: string[] = [];

        set((state) => ({
          items: state.items.map((item) => {
            const stock = inventoryMap.get(item.id) ?? 0;
            const nextQuantity = stock > 0 ? Math.min(item.quantity, stock) : item.quantity;

            if (stock <= 0 && item.stock > 0) {
              messages.push(`Sản phẩm "${item.name}" hiện đã hết hàng`);
            } else if (stock > 0 && item.quantity > stock) {
              messages.push(`Đã giảm "${item.name}" về ${stock} sản phẩm theo tồn kho`);
            }

            return {
              ...item,
              stock,
              quantity: nextQuantity,
            };
          }),
        }));

        if (messages.length === 1) {
          toast.warning(messages[0]);
        } else if (messages.length > 1) {
          toast.warning("Giỏ hàng đã được cập nhật theo tồn kho mới nhất");
        }
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
