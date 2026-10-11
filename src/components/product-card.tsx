"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { productHref, productImage } from "@/lib/catalog";
import { useCart } from "@/components/cart-provider";

export function ProductCard({ product }: { product: Product }) {
  const { add, wishlist, toggleWishlist } = useCart();
  const saved = wishlist.includes(product._id);
  return <article className="group">
    <div className="relative overflow-hidden bg-[#eee7dd]">
      <Link href={productHref(product.slug)} className="relative block aspect-[.82]">
        <Image src={productImage(product.image)} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
      </Link>
      {product.badge && <span className="absolute left-3 top-3 bg-[#fbf8f3] px-3 py-1.5 text-[8px] uppercase tracking-[.16em]">{product.badge}</span>}
      <button aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} onClick={() => toggleWishlist(product._id)} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#fbf8f3]/90"><Heart size={15} fill={saved ? "#a85f45" : "none"} color={saved ? "#a85f45" : "#4a3a31"} strokeWidth={1.4} /></button>
      <button onClick={() => add(product)} className="absolute bottom-0 left-0 right-0 translate-y-full bg-[#4a3a31] py-3 text-[9px] uppercase tracking-[.2em] text-white transition group-hover:translate-y-0">Add to bag</button>
    </div>
    <div className="flex items-center justify-between pt-3">
      <div><Link href={productHref(product.slug)} className="font-display text-[20px]">{product.name}</Link><p className="mt-1 text-[10px] text-[#82776d]">{product.size} · {product.burnTime}</p></div>
      <span className="text-xs">₹{product.price.toLocaleString("en-IN")}</span>
    </div>
    <div className="mt-2 flex items-center gap-1 text-[#a85f45]"><Star size={11} fill="currentColor" /><span className="text-[9px] text-[#82776d]">{product.rating}</span></div>
  </article>;
}
