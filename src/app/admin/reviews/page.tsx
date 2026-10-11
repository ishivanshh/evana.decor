"use client";
import { useEffect, useState } from "react";
type Review = { _id: string; name: string; rating: number; body: string; approved: boolean; productId: { name: string } | null };
export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  async function load() { const response = await fetch("/api/admin/reviews"); if (response.ok) setReviews((await response.json()).reviews); }
  useEffect(() => { void load(); }, []);
  async function moderate(review: Review, approved: boolean) { await fetch(`/api/admin/reviews/${review._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ approved }) }); await load(); }
  return <div><p className="eyebrow">Thoughts from the community</p><h1 className="font-display mt-2 text-5xl">Reviews</h1><div className="mt-7 space-y-4">{reviews.map(review => <article key={review._id} className="border border-[#e8e1d8] bg-[#fbf8f3] p-5"><div className="flex flex-wrap justify-between gap-2"><div><h2 className="font-display text-2xl">{review.productId?.name ?? "Product"}</h2><p className="mt-1 text-xs text-[#82776d]">{review.name} · {review.rating}/5</p></div><span className="text-xs">{review.approved ? "Published" : "Needs review"}</span></div><p className="mt-4 text-sm leading-6">{review.body}</p><div className="mt-4 flex gap-4 text-xs">{!review.approved && <button onClick={() => void moderate(review, true)} className="text-green-800 underline">Approve</button>}<button onClick={() => void moderate(review, false)} className="text-red-800 underline">Hide</button></div></article>)}{reviews.length === 0 && <p className="border border-[#e8e1d8] bg-[#fbf8f3] p-8 text-center text-sm text-[#82776d]">No reviews submitted yet.</p>}</div></div>;
}
