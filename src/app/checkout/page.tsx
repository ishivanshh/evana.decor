"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";

const inputClass = "mt-1 w-full border border-[#ded5cb] bg-[#fffdfa] px-3 py-3 text-sm outline-none focus:border-[#a85f45]";
type FormData = { name: string; email: string; phone: string; line1: string; line2: string; city: string; state: string; pincode: string };
const initialForm: FormData = { name: "", email: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" };

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, shippingCharge, freeShippingThreshold, codCharge } = useCart();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponMessage, setCouponMessage] = useState("");
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingCharge;
  if (!lines.length) return <div className="container-page py-28 text-center"><h1 className="font-display text-4xl">Your bag is empty</h1><Link className="btn-primary mt-6" href="/shop">Find your candle</Link></div>;
  const update = (key: keyof FormData, value: string) => setForm(current => ({ ...current, [key]: value }));
  async function applyCoupon() {
    setCouponMessage("");
    if (!coupon.trim()) { setAppliedCoupon(null); return; }
    try {
      const response = await fetch("/api/coupons/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: coupon, subtotal }) });
      const result = await response.json();
      if (!response.ok) { setAppliedCoupon(null); setCouponMessage(result.error); return; }
      setAppliedCoupon({ code: result.code, discount: result.discount }); setCouponMessage("A little saving, just for you.");
    } catch { setCouponMessage("We couldn't validate that code. Please try again."); }
  }
  async function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        customer: { name: form.name, email: form.email, phone: form.phone },
        address: { line1: form.line1, line2: form.line2, city: form.city, state: form.state, pincode: form.pincode },
        items: lines.map(line => ({ slug: line.product.slug, quantity: line.quantity })),
        couponCode: appliedCoupon?.code, paymentMethod: "COD",
      }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "We couldn't place your order. Please try again.");
      window.localStorage.setItem("evana-last-order", JSON.stringify(result));
      router.push(`/order-confirmation?order=${encodeURIComponent(result.orderNumber)}`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to place your order."); }
    finally { setBusy(false); }
  }
  return <div className="container-page py-12">
    <p className="eyebrow">Almost home</p><h1 className="font-display mt-3 text-5xl">Checkout</h1>
    <form onSubmit={placeOrder} className="mt-9 grid gap-10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        <section><h2 className="font-display text-3xl">Your details</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
          {([["name", "Full name", "text"], ["email", "Email address", "email"], ["phone", "Mobile number", "tel"]] as const).map(([key, label, type]) => <label key={key} className={`text-xs ${key === "name" ? "sm:col-span-2" : ""}`}>{label}<input required type={type} value={form[key]} onChange={e => update(key, e.target.value)} className={inputClass} /></label>)}
        </div></section>
        <section><h2 className="font-display text-3xl">Where should we send it?</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-xs sm:col-span-2">Address line 1<input required value={form.line1} onChange={e => update("line1", e.target.value)} className={inputClass} /></label>
          <label className="text-xs sm:col-span-2">Apartment, floor, landmark <span className="text-[#82776d]">(optional)</span><input value={form.line2} onChange={e => update("line2", e.target.value)} className={inputClass} /></label>
          {([["city", "City"], ["state", "State"], ["pincode", "PIN code"]] as const).map(([key, label]) => <label key={key} className="text-xs">{label}<input required value={form[key]} onChange={e => update(key, e.target.value)} inputMode={key === "pincode" ? "numeric" : "text"} className={inputClass} /></label>)}
        </div></section>
        <section><h2 className="font-display text-3xl">Payment</h2><div className="mt-4 border border-[#a85f45] bg-[#fffdfa] p-4"><div className="flex items-center gap-3"><span className="h-4 w-4 rounded-full border-[5px] border-[#a85f45]" /><div><p className="text-sm">Cash on delivery</p><p className="mt-1 text-xs text-[#82776d]">Pay in cash when your Evana parcel arrives.</p></div><span className="ml-auto text-[9px] uppercase tracking-wider text-[#a85f45]">Available</span></div></div>
          {["UPI", "Credit / debit card", "Net banking", "Wallets"].map(method => <div key={method} aria-disabled="true" className="mt-2 flex items-center gap-3 border border-[#e8e1d8] p-4 text-sm text-[#a59b92]"><span className="h-4 w-4 rounded-full border border-[#d3c8bc]" />{method}<span className="ml-auto text-[9px] uppercase tracking-wider">Coming soon</span></div>)}
        </section>
      </div>
      <aside className="h-fit bg-[#f1ebe3] p-6"><h2 className="font-display text-3xl">Your order</h2>{lines.map(line => <div key={line.product._id} className="mt-4 flex justify-between gap-4 text-xs"><span>{line.product.name} × {line.quantity}</span><span>₹{(line.product.price * line.quantity).toLocaleString("en-IN")}</span></div>)}
        <label className="mt-6 block text-xs">Discount code<input value={coupon} onChange={e => { setCoupon(e.target.value); setAppliedCoupon(null); setCouponMessage(""); }} placeholder="If you have one" className={inputClass} /></label><button type="button" onClick={() => void applyCoupon()} className="mt-2 text-[10px] uppercase tracking-widest underline">Apply code</button>{couponMessage && <p role="status" className="mt-2 text-xs text-[#71665d]">{couponMessage}</p>}
        <div className="mt-5 flex justify-between border-t border-[#d8cec3] pt-4 text-sm"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>{appliedCoupon && <div className="mt-2 flex justify-between text-sm text-green-800"><span>Discount ({appliedCoupon.code})</span><span>−₹{appliedCoupon.discount.toLocaleString("en-IN")}</span></div>}<div className="mt-2 flex justify-between text-sm"><span>Shipping</span><span>{shipping ? `₹${shipping}` : "Free"}</span></div>{codCharge > 0 && <div className="mt-2 flex justify-between text-sm"><span>COD charge</span><span>₹{codCharge.toLocaleString("en-IN")}</span></div>}<div className="mt-4 flex justify-between border-t border-[#d8cec3] pt-4 text-sm font-medium"><span>Estimated total</span><span>₹{(subtotal - (appliedCoupon?.discount ?? 0) + shipping + codCharge).toLocaleString("en-IN")}</span></div>
        {error && <p role="alert" className="mt-4 bg-[#f8e4df] p-3 text-xs text-[#8b3328]">{error}</p>}
        <button disabled={busy} className="btn-primary mt-6 w-full disabled:opacity-60">{busy ? "Placing your order…" : "Place COD order"}</button><p className="mt-3 text-center text-[10px] text-[#82776d]">By placing an order, you agree to our <Link className="underline" href="/terms">terms</Link>.</p>
      </aside>
    </form>
  </div>;
}
