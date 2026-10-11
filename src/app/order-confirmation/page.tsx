"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart-provider";

export default function OrderConfirmationPage() {
  const params = useSearchParams();
  const { clear } = useCart();
  const [order, setOrder] = useState<{ orderNumber: string; total: number; status: string } | null>(null);
  useEffect(() => {
    const fromStorage = window.localStorage.getItem("evana-last-order");
    if (fromStorage) { try { const parsed = JSON.parse(fromStorage) as typeof order; if (parsed?.orderNumber === params.get("order")) { setOrder(parsed); clear(); } } catch { window.localStorage.removeItem("evana-last-order"); } }
  }, [params, clear]);
  return <section className="container-page min-h-[65vh] py-24 text-center"><p className="eyebrow">A little something is on its way</p><h1 className="font-display mt-4 text-5xl md:text-6xl">Thank you for choosing Evana.</h1><p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#82776d]">Your order is in our hands. We’ll send you an email as soon as it’s confirmed, and another when your parcel begins its journey.</p>
    {order && <div className="mx-auto mt-8 max-w-md border border-[#e8e1d8] bg-[#fffdfa] p-6"><p className="text-[10px] uppercase tracking-widest text-[#82776d]">Order number</p><p className="mt-2 text-lg">{order.orderNumber}</p><p className="mt-3 text-sm">₹{order.total.toLocaleString("en-IN")} · Cash on delivery</p><p className="mt-3 text-xs text-[#a85f45]">Status: {order.status}</p></div>}
    <div className="mt-8 flex justify-center gap-3"><Link href="/shop" className="btn-outline">Keep browsing</Link><Link href="/track-order" className="btn-primary">Track order</Link></div>
  </section>;
}
