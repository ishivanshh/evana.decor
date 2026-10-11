"use client";

import { useState } from "react";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");
  const [order, setOrder] = useState<{ orderNumber: string; status: string; total: number; statusHistory: { status: string; at: string; note: string }[] } | null>(null);
  async function lookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setOrder(null);
    const response = await fetch("/api/orders/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderNumber, contact }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error); return; }
    setOrder(data.order);
  }
  return <div className="container-page min-h-[65vh] py-20"><div className="mx-auto max-w-lg"><p className="eyebrow">Your Evana parcel</p><h1 className="font-display mt-3 text-5xl">Track your order</h1><p className="mt-4 text-sm leading-6 text-[#82776d]">Enter your order number and the phone number or email used at checkout.</p><form onSubmit={lookup} className="mt-8 space-y-4"><label className="block text-xs">Order number<input required value={orderNumber} onChange={e => setOrderNumber(e.target.value)} className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-3 outline-none" /></label><label className="block text-xs">Phone or email<input required value={contact} onChange={e => setContact(e.target.value)} className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-3 outline-none" /></label><button className="btn-primary w-full">Find my order</button></form>{error && <p role="alert" className="mt-4 bg-[#f8e4df] p-3 text-sm text-[#8b3328]">{error}</p>}
      {order && <section className="mt-8 border border-[#e8e1d8] bg-white p-6"><div className="flex justify-between"><div><p className="text-xs text-[#82776d]">Order</p><p className="mt-1">{order.orderNumber}</p></div><div className="text-right"><p className="text-xs text-[#82776d]">Status</p><p className="mt-1 text-[#a85f45]">{order.status}</p></div></div><p className="mt-3 text-sm">₹{order.total.toLocaleString("en-IN")}</p><ol className="mt-6 space-y-4 border-l border-[#d8cec3] pl-4">{order.statusHistory.map((item, index) => <li key={`${item.status}-${index}`} className="text-sm"><p>{item.status}</p><p className="mt-1 text-xs text-[#82776d]">{item.note} · {new Date(item.at).toLocaleDateString("en-IN")}</p></li>)}</ol></section>}
    </div></div>;
}
