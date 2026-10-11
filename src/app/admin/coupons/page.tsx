"use client";
import { useEffect, useState } from "react";
type Coupon = { _id: string; code: string; type: string; value: number; active: boolean; minimum: number };
export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [error, setError] = useState("");
  async function load() { const response = await fetch("/api/admin/coupons"); if (response.ok) setCoupons((await response.json()).coupons); }
  useEffect(() => { void load(); }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/admin/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const result = await response.json(); if (!response.ok) setError(result.error); else { event.currentTarget.reset(); await load(); }
  }
  async function toggle(coupon: Coupon) { await fetch(`/api/admin/coupons/${coupon.code}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !coupon.active }) }); await load(); }
  return <div><p className="eyebrow">A little thank-you</p><h1 className="font-display mt-2 text-5xl">Coupons</h1><div className="mt-7 grid gap-8 md:grid-cols-[1fr_360px]"><section className="space-y-3">{coupons.map(coupon => <article key={coupon._id} className="flex items-center justify-between border border-[#e8e1d8] bg-[#fbf8f3] p-5"><div><p className="text-sm font-medium">{coupon.code}</p><p className="mt-1 text-xs text-[#82776d]">{coupon.type === "PERCENT" ? `${coupon.value}% off` : `₹${coupon.value} off`} · min ₹{coupon.minimum}</p></div><button onClick={() => void toggle(coupon)} className="text-xs underline">{coupon.active ? "Active" : "Paused"}</button></article>)}</section><form onSubmit={submit} className="h-fit border border-[#e8e1d8] bg-[#fbf8f3] p-5"><h2 className="font-display text-3xl">Create code</h2><label className="mt-4 block text-xs">Code<input required name="code" className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-2 uppercase" /></label><label className="mt-4 block text-xs">Discount type<select name="type" className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-2"><option value="PERCENT">Percentage</option><option value="FLAT">Flat amount (₹)</option></select></label><label className="mt-4 block text-xs">Value<input required name="value" type="number" min="1" className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-2" /></label><label className="mt-4 block text-xs">Minimum order value<input name="minimum" type="number" min="0" defaultValue="0" className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-2" /></label><label className="mt-4 block text-xs">Expiry date <span className="text-[#82776d]">(optional)</span><input name="expiresAt" type="date" className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-2" /></label>{error && <p role="alert" className="mt-3 text-xs text-red-800">{error}</p>}<button className="btn-primary mt-4 w-full">Create coupon</button></form></div></div>;
}
