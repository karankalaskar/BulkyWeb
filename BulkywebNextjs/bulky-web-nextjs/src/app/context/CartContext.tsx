"use client";
import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { Product } from "@/types/product";
import { toast } from "react-hot-toast";
import { getToken } from "../utils/auth";
// import { configureStore } from "@reduxjs/toolkit";

type CartItem = Product & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  updateQuantity: (id: number, quantity: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartKey, setCartKey] = useState("cart_items_guest");

   useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId =
          payload.sub || payload.userId || payload.email || "guest";
        setCartKey(`cart_items_${userId}`);
      } catch (err) {
        console.error("Invalid token payload", err);
        setCartKey("cart_items_guest");
      }
    } else {
      setCartKey("cart_items_guest");
    }
  }, []);

   useEffect(() => {
    try {
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart && savedCart !== "undefined") {
        setCart(JSON.parse(savedCart));
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Failed to load cart:", err);
      setCart([]);
    }
  }, [cartKey]);

   const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem(cartKey, JSON.stringify(newCart));
  };

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      const updated = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCart(updated);
      toast.success(`${product.title} quantity increased`);
    } else {
      const updated = [...cart, { ...product, quantity: 1 }];
      saveCart(updated);
      toast.success(`${product.title} added to cart`);
    }
  };

  const removeFromCart = (id: number) => {
    const removedItem = cart.find((item) => item.id === id);
    const updated = cart.filter((item) => item.id !== id);
    saveCart(updated);
    toast(`${removedItem?.title} removed from cart`);
  };

  const clearCart = () => {
    saveCart([]);
    toast("Cart cleared");
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    saveCart(updated);
    toast("Quantity updated");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
