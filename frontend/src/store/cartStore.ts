import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.product._id === product._id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product._id === product._id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        }),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.product._id !== productId) })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((i) => i.product._id !== productId)
            : state.items.map((i) => (i.product._id === productId ? { ...i, quantity } : i)),
        })),

      clearCart: () => set({ items: [] }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      setDrawerOpen: (open) => set({ isDrawerOpen: open }),

      getTotal: () =>
        get().items.reduce((sum, item) => {
          const price = item.product.discountedPrice ?? item.product.price;
          return sum + price * item.quantity;
        }, 0),

      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'tazekoy-cart' }
  )
);
