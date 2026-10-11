"use client";

import { useEffect, useState } from "react";
import { products } from "@/lib/catalog";

export default function FeedbackPage() {
  const [availableProducts, setAvailableProducts] = useState(products);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    fetch("/api/products").then(async response => {
      if (!response.ok) throw new Error("Could not fetch product list.");
      const data = await response.json();
      if (active && Array.isArray(data.products) && data.products.length) setAvailableProducts(data.products);
    }).catch(cause => console.error("Unable to load feedback product list:", cause));
    return () => { active = false; };
  }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMessage("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: form.get("slug"), name: form.get("name"), rating: Number(form.get("rating")), body: form.get("body") }) });
      const result = await response.json();
      if (!response.ok) setError(result.error ?? "We couldn't submit your feedback.");
      else { setMessage("Thank you for sharing your thoughts. Your feedback will appear once reviewed."); formElement.reset(); }
    } catch { setError("We couldn't submit your feedback. Please try again."); }
  }
  return <div className="container-page min-h-[65vh] py-16"><div className="mx-auto max-w-xl"><p className="eyebrow">Your candle, your words</p><h1 className="font-display mt-3 text-6xl">Share your feedback.</h1><p className="mt-4 text-sm leading-7 text-[#82776d]">Tell us what you thought of a candle. Your review helps us make each little ritual better.</p><form onSubmit={submit} className="mt-8 space-y-4"><label className="block text-xs">Your name<input required name="name" minLength={2} maxLength={80} className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-3 outline-none" /></label><label className="block text-xs">Which candle?<select required name="slug" className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-3 outline-none">{availableProducts.map(product => <option key={product.slug} value={product.slug}>{product.name}</option>)}</select></label><label className="block text-xs">Your rating<select required name="rating" className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-3 outline-none">{[5, 4, 3, 2, 1].map(rating => <option key={rating} value={rating}>{rating} star{rating === 1 ? "" : "s"}</option>)}</select></label><label className="block text-xs">Your feedback<textarea required name="body" minLength={15} maxLength={1000} rows={5} placeholder="How did it make your space feel?" className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-3 outline-none" /></label>{error && <p role="alert" className="text-sm text-red-800">{error}</p>}{message && <p role="status" className="text-sm text-green-800">{message}</p>}<button className="btn-primary w-full">Send feedback</button></form></div></div>;
}
