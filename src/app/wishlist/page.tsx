"use client";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { ProductCard } from "@/components/product-card";
import { products, type Product } from "@/lib/catalog";
import { useEffect, useState } from "react";
export default function WishlistPage() {
  const { wishlist } = useCart();
  const [catalog, setCatalog] = useState<Product[]>(products);
  useEffect(() => { let active = true; fetch("/api/products").then(async response => { if (!response.ok) throw new Error("Unable to load products"); const data = await response.json(); if (active && Array.isArray(data.products)) setCatalog(data.products); }).catch(error => console.error("Unable to load wishlist products:", error)); return () => { active = false; }; }, []);
  const saved = catalog.filter(product => wishlist.includes(product._id));
  return <div className="container-page min-h-[60vh] py-16"><p className="eyebrow">Saved for a slower day</p><h1 className="font-display mt-2 text-5xl">Your wishlist</h1>{saved.length ? <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">{saved.map(product => <ProductCard key={product._id} product={product} />)}</div> : <div className="mt-12 border-t border-[#e8e1d8] py-12 text-center"><p className="font-display text-3xl">Keep the ones you love close.</p><p className="mt-3 text-sm text-[#82776d]">Tap the heart on a candle to save it here.</p><Link href="/shop" className="btn-primary mt-6">Explore the collection</Link></div>}</div>;
}
