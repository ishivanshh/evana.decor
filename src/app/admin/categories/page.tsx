"use client";
import { useEffect, useState } from "react";
type Category = { _id: string; name: string; slug: string; description?: string };
export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [error, setError] = useState("");
  async function load() { const response = await fetch("/api/admin/categories"); if (response.ok) setItems((await response.json()).categories); }
  useEffect(() => { void load(); }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
    const data = await response.json();
    if (!response.ok) setError(data.error); else { event.currentTarget.reset(); await load(); }
  }
  return <div><p className="eyebrow">Collections, considered</p><h1 className="font-display mt-2 text-5xl">Collections</h1><div className="mt-7 grid gap-8 md:grid-cols-[1fr_340px]"><section className="space-y-3">{items.map(item => <article key={item._id} className="border border-[#e8e1d8] bg-[#fbf8f3] p-5"><h2 className="font-display text-2xl">{item.name}</h2><p className="mt-1 text-xs text-[#82776d]">/{item.slug}</p>{item.description && <p className="mt-3 text-sm">{item.description}</p>}</article>)}</section><form onSubmit={submit} className="h-fit border border-[#e8e1d8] bg-[#fbf8f3] p-5"><h2 className="font-display text-3xl">Add collection</h2><label className="mt-4 block text-xs">Name<input required name="name" className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-2" /></label><label className="mt-4 block text-xs">URL slug<input required name="slug" pattern="[a-z0-9]+(-[a-z0-9]+)*" className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-2" /></label><label className="mt-4 block text-xs">Description<textarea name="description" className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-2" /></label>{error && <p role="alert" className="mt-3 text-xs text-red-800">{error}</p>}<button className="btn-primary mt-4 w-full">Create collection</button></form></div></div>;
}
