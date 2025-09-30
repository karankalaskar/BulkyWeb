"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-hot-toast";
import { Product } from "@/types/product";
 
import { getToken } from "@/app/utils/auth";

type CartItem = Product & { quantity: number };

interface  CartState  {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  updateQuantity: (id: number, quantity: number) => void;
  migrateGuestCartToUser: () => void;
};

const GUEST_KEY = "cart_items_guest";

interface JWTPayload {
  sub?: string;
  userId?: string;
  email?: string;
  [key: string]: unknown;
}

const getCartKey = (): string => {
  if (typeof window === "undefined") return GUEST_KEY;
  const token = getToken?.();
  if (!token) return GUEST_KEY;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as JWTPayload;
    const userId = payload.sub ?? payload.userId ?? payload.email ?? "guest";
    return `cart_items_${userId}`;
  } catch (err) {
    console.error("Invalid token payload", err);
    return GUEST_KEY;
  }
};

export const useCartStore = create<CartState>()(
  persist<CartState>(
    (set, get) => ({
      cart: [],

      setCart: (cart: CartItem[]) => set({ cart }),

      addToCart: (product: Product) => {
        const existing = get().cart.find((i) => i.id === product.id);
        if (existing) {
          set({
            cart: get().cart.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
          toast.success(`${product.title} quantity increased`);
        } else {
          set({ cart: [...get().cart, { ...product, quantity: 1 }] });
          toast.success(`${product.title} added to cart`);
        }
      },

      removeFromCart: (id: number) => {
        const removed = get().cart.find((i) => i.id === id);
        set({ cart: get().cart.filter((i) => i.id !== id) });
        toast(`${removed?.title} removed from cart`);
      },

      clearCart: () => {
        set({ cart: [] });
        toast("Cart cleared");
      },

      updateQuantity: (id: number, quantity: number) => {
        if (quantity < 1) return;
        set({
          cart: get().cart.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
        toast("Quantity updated");
      },

      migrateGuestCartToUser: () => {
        if (typeof window === "undefined") return;
        try {
          const newKey = getCartKey();
          if (newKey === GUEST_KEY) return;

          const guestRaw = localStorage.getItem(GUEST_KEY);
          if (!guestRaw) return;

          const guestCart = (JSON.parse(guestRaw) as CartItem[]) || [];
          const userRaw = localStorage.getItem(newKey);
          const userCart = (userRaw ? (JSON.parse(userRaw) as CartItem[]) : []) || [];

 
          const mergedMap = new Map<number, CartItem>();
          [...userCart, ...guestCart].forEach((item) => {
            const existing = mergedMap.get(item.id);
            if (existing) {
              mergedMap.set(item.id, {
                ...existing,
                quantity: existing.quantity + item.quantity,
              });
            } else {
              mergedMap.set(item.id, { ...item });
            }
          });

          const merged = Array.from(mergedMap.values());

          localStorage.setItem(newKey, JSON.stringify(merged));
          localStorage.removeItem(GUEST_KEY);
          set({ cart: merged });
        } catch (err) {
          console.error("Failed to migrate guest cart", err);
        }
      },
    }),
    {
      name: getCartKey(),
      storage: createJSONStorage(() => localStorage),
    }
  )
);