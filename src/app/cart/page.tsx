"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { CheckoutLink } from "@/components/checkout-link";
import { productImage } from "@/lib/catalog";

export default function CartPage() {
  const { lines, subtotal, update, remove, shippingCharge, freeShippingThreshold } = useCart();
  if (!lines.length) return <div className="container-page py-28 text-center"><p className="eyebrow">Your bag is waiting</p><h1 className="font-display mt-4 text-5xl">A little room for something lovely.</h1><Link href="/shop" className="btn-primary mt-8">Explore the collection</Link></div>;
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingCharge;
  return <div className="container-page min-h-[65vh] py-14">
    <p className="eyebrow">Your rituals, together</p><h1 className="font-display mt-3 text-5xl">Shopping bag</h1>
    <div className="mt-9 grid gap-12 lg:grid-cols-[1fr_340px]">
      <div>{lines.map(({ product, quantity }) => <div key={product._id} className="grid grid-cols-[100px_1fr_auto] gap-4 border-t border-[#e8e1d8] py-5 sm:grid-cols-[130px_1fr_auto]">
        <div className="relative aspect-square overflow-hidden bg-[#eee7dd]"><Image src={productImage(product.image, 400)} alt={product.name} fill sizes="130px" className="object-cover" /></div>
        <div><Link href={`/products/${product.slug}`} className="font-display text-2xl">{product.name}</Link><p className="mt-1 text-xs text-[#82776d]">{product.size} · {product.burnTime}</p><div className="mt-4 flex w-fit items-center border border-[#d8cec3] text-sm"><button onClick={() => update(product._id, quantity - 1)} className="px-3 py-1.5">−</button><span>{quantity}</span><button onClick={() => update(product._id, quantity + 1)} className="px-3 py-1.5">+</button></div></div>
        <div className="text-right"><p className="text-sm">₹{(product.price * quantity).toLocaleString("en-IN")}</p><button aria-label={`Remove ${product.name}`} onClick={() => remove(product._id)} className="mt-4 text-[#82776d]"><Trash2 size={15} /></button></div>
      </div>)}</div>
      <aside className="h-fit bg-[#f1ebe3] p-6"><h2 className="font-display text-3xl">Order summary</h2><div className="mt-6 flex justify-between text-sm"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div><div className="mt-3 flex justify-between text-sm"><span>Shipping</span><span>{shipping ? `₹${shipping}` : "Complimentary"}</span></div><p className="mt-3 text-[10px] text-[#82776d]">{subtotal >= freeShippingThreshold ? "You've unlocked complimentary shipping." : `Add ₹${(freeShippingThreshold - subtotal).toLocaleString("en-IN")} for complimentary shipping.`}</p><div className="mt-5 flex justify-between border-t border-[#d8cec3] pt-5 text-base"><span>Total</span><span>₹{(subtotal + shipping).toLocaleString("en-IN")}</span></div><CheckoutLink className="btn-primary mt-6 w-full">Place order</CheckoutLink><Link href="/shop" className="mt-4 block text-center text-[10px] uppercase tracking-widest">Continue shopping</Link></aside>
    </div>
  </div>;
}
