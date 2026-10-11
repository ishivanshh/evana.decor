"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/catalog";

type CartLine = { product: Product; quantity: number };
type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (product: Product, quantity?: number) => void;
  update: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  drawerOpen: boolean;
  closeDrawer: () => void;
  shippingCharge: number;
  freeShippingThreshold: number;
  codCharge: number;
  whatsappNumber: string;
};
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [storeSettings, setStoreSettings] = useState({ shippingCharge: 99, freeShippingThreshold: 1999, codCharge: 0, whatsappNumber: "" });
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const saved = window.localStorage.getItem("evana-cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CartLine[];
        if (Array.isArray(parsed)) setLines(parsed.filter(line => line?.product?._id && Number.isInteger(line.quantity) && line.quantity > 0));
      }
      catch { window.localStorage.removeItem("evana-cart"); }
    }
    const savedWishlist = window.localStorage.getItem("evana-wishlist");
    if (savedWishlist) {
      try { const parsed = JSON.parse(savedWishlist) as unknown; if (Array.isArray(parsed) && parsed.every(item => typeof item === "string")) setWishlist(parsed); }
      catch { window.localStorage.removeItem("evana-wishlist"); }
    }
    setHydrated(true);
    fetch("/api/store-info").then(async response => {
      if (!response.ok) throw new Error("Store settings unavailable.");
      const data = await response.json();
      setStoreSettings(current => ({ ...current, ...data.settings }));
    }).catch(error => console.error("Unable to load store settings:", error));
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("evana-cart", JSON.stringify(lines));
    window.localStorage.setItem("evana-wishlist", JSON.stringify(wishlist));
  }, [lines, wishlist, hydrated]);
  const value = useMemo<CartContextValue>(() => ({
    lines,
    wishlist,
    drawerOpen,
    ...storeSettings,
    count: lines.reduce((total, line) => total + line.quantity, 0),
    subtotal: lines.reduce((total, line) => total + line.product.price * line.quantity, 0),
    add: (product, quantity = 1) => {
      setLines(current => {
        const found = current.find(line => line.product._id === product._id);
        return found ? current.map(line => line.product._id === product._id ? { ...line, quantity: line.quantity + quantity } : line) : [...current, { product, quantity }];
      });
      setDrawerOpen(true);
    },
    update: (id, quantity) => setLines(current => quantity < 1 ? current.filter(line => line.product._id !== id) : current.map(line => line.product._id === id ? { ...line, quantity } : line)),
    remove: id => setLines(current => current.filter(line => line.product._id !== id)),
    clear: () => setLines([]),
    toggleWishlist: id => setWishlist(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]),
    closeDrawer: () => setDrawerOpen(false),
  }), [lines, wishlist, drawerOpen, storeSettings]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
