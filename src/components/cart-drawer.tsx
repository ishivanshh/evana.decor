"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { CheckoutLink } from "@/components/checkout-link";
import { productImage } from "@/lib/catalog";
export function CartDrawer() {
  const pathname = usePathname();
  const { lines, subtotal, update, closeDrawer, drawerOpen } = useCart();
  if (!drawerOpen || pathname.startsWith("/admin")) return null;
  return <div className="fixed inset-0 z-50 bg-[#261e19]/45" onMouseDown={event => { if (event.target === event.currentTarget) closeDrawer(); }}>
    <aside role="dialog" aria-modal="true" aria-label="Shopping bag" className="ml-auto flex h-full w-full max-w-md flex-col bg-[#fbf8f3] p-6 shadow-2xl">
      <div className="flex items-center justify-between border-b border-[#e8e1d8] pb-5"><div><p className="eyebrow">Your rituals, together</p><h2 className="font-display mt-1 text-3xl">Shopping bag <span className="text-lg">({lines.length})</span></h2></div><button onClick={closeDrawer} aria-label="Close shopping bag"><X size={20} /></button></div>
      <div className="flex-1 overflow-auto">{lines.length === 0 ? <p className="py-10 text-center text-sm text-[#82776d]">Your bag is empty.</p> : lines.map(({ product, quantity }) => <div key={product._id} className="flex gap-4 border-b border-[#e8e1d8] py-5"><div className="relative h-24 w-20 shrink-0 overflow-hidden bg-[#eee7dd]"><Image src={productImage(product.image, 300)} alt={product.name} fill sizes="80px" className="object-cover" /></div><div className="flex-1"><p className="font-display text-xl">{product.name}</p><p className="mt-1 text-xs">₹{product.price.toLocaleString("en-IN")}</p><div className="mt-3 flex items-center gap-3 text-xs"><button onClick={() => update(product._id, quantity - 1)} aria-label="Decrease quantity">−</button><span>{quantity}</span><button onClick={() => update(product._id, quantity + 1)} aria-label="Increase quantity">+</button></div></div></div>)}</div>
      {lines.length > 0 && <div className="border-t border-[#e8e1d8] pt-5"><div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div><p className="mt-2 text-[10px] text-[#82776d]">Shipping and any discounts are calculated at checkout.</p><Link href="/cart" onClick={closeDrawer} className="btn-outline mt-4 w-full">View bag</Link><CheckoutLink onNavigate={closeDrawer} className="btn-primary mt-2 w-full">Checkout</CheckoutLink></div>}
    </aside>
  </div>;
}
