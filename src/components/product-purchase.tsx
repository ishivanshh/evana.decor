"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/catalog";
import { Button } from "@/components/ui/button";

export function ProductPurchase({ product }: { product: Product }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  return <div className="mt-7 flex gap-3">
    <div className="flex items-center border border-[#d8cec3]"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3">−</button><span className="min-w-5 text-center text-sm">{quantity}</span><button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3">+</button></div>
    <Button onClick={() => { add(product, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 1800); }} className="flex-1">{added ? "Added to your bag" : "Add to bag"}</Button>
  </div>;
}
