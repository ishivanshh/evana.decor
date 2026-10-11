"use client";
import { useCallback, useEffect, useState } from "react";
type Review = { _id: string; name: string; rating: number; body: string; createdAt: string };
export function ReviewSection({ slug }: { slug: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const load = useCallback(async () => { const response = await fetch(`/api/reviews?slug=${encodeURIComponent(slug)}`); if (response.ok) setReviews((await response.json()).reviews); }, [slug]);
  useEffect(() => { void load(); }, [load]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(""); setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, slug, rating: Number(data.rating) }) });
    const result = await response.json();
    if (!response.ok) setError(result.error); else { setMessage(result.message); event.currentTarget.reset(); }
  }
  return <section className="container-page py-16"><div className="grid gap-10 md:grid-cols-[1fr_320px]"><div><p className="eyebrow">Notes from your homes</p><h2 className="font-display mt-2 text-4xl">Reviews</h2><div className="mt-6 space-y-4">{reviews.map(review => <article key={review._id} className="border-t border-[#e8e1d8] py-4"><p className="text-xs text-[#a85f45]">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p><p className="mt-2 text-sm leading-6">{review.body}</p><p className="mt-2 text-xs text-[#82776d]">{review.name} · {new Date(review.createdAt).toLocaleDateString("en-IN")}</p></article>)}{reviews.length === 0 && <p className="border-t border-[#e8e1d8] py-4 text-sm text-[#82776d]">Be the first to leave a little note.</p>}</div></div><form onSubmit={submit} className="h-fit bg-[#f1ebe3] p-5"><h3 className="font-display text-2xl">Share your experience</h3><label className="mt-4 block text-xs">Your name<input required name="name" maxLength={80} className="mt-2 w-full bg-white px-3 py-2" /></label><label className="mt-4 block text-xs">Rating<select name="rating" className="mt-2 w-full bg-white px-3 py-2">{[5,4,3,2,1].map(value => <option key={value} value={value}>{value} stars</option>)}</select></label><label className="mt-4 block text-xs">Your review<textarea required name="body" minLength={15} maxLength={1000} rows={4} className="mt-2 w-full bg-white px-3 py-2" /></label>{error && <p role="alert" className="mt-3 text-xs text-red-800">{error}</p>}{message && <p role="status" className="mt-3 text-xs text-green-800">{message}</p>}<button className="btn-primary mt-4 w-full">Submit review</button></form></div></section>;
}
