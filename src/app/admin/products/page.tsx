"use client";

import { useEffect, useState } from "react";
type AdminProduct = { _id: string; name: string; slug: string; category: string; scent: string; size: string; burnTime: string; price: number; stock: number; published: boolean; image: string; description: string };
export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function load() { const response = await fetch("/api/admin/products"); if (response.ok) setProducts((await response.json()).products); }
  useEffect(() => { void load(); }, []);
  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const element = event.currentTarget;
    const form = new FormData(element);
    const file = form.get("file");
    if (file instanceof File && file.size > 0) {
      const upload = new FormData(); upload.set("file", file);
      const uploadResponse = await fetch("/api/admin/upload", { method: "POST", body: upload });
      const uploaded = await uploadResponse.json();
      if (!uploadResponse.ok) { setMessage(uploaded.error); setBusy(false); return; }
      form.set("image", uploaded.url);
    }
    const response = await fetch(editing ? `/api/admin/products/${editing.slug}` : "/api/admin/products", { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
    const result = await response.json();
    if (!response.ok) setMessage(result.error); else { element.reset(); setEditing(null); setMessage(editing ? "Product updated." : "Product created."); await load(); }
    setBusy(false);
  }
  async function toggle(product: AdminProduct) {
    const response = await fetch(`/api/admin/products/${product.slug}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !product.published }) });
    if (response.ok) await load();
  }
  return <div><p className="eyebrow">Your collection</p><h1 className="font-display mt-2 text-5xl">Products</h1><div className="mt-7 grid gap-8 xl:grid-cols-[1fr_360px]"><section className="overflow-x-auto border border-[#e8e1d8] bg-[#fbf8f3]"><table className="w-full min-w-[560px] text-left text-xs"><thead><tr className="border-b border-[#e8e1d8] text-[#82776d]"><th className="p-4">Name</th><th className="p-4">Collection</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Actions</th></tr></thead><tbody>{products.map(product => <tr key={product._id} className="border-b border-[#eee8e1]"><td className="p-4">{product.name}</td><td className="p-4">{product.category}</td><td className="p-4">₹{product.price.toLocaleString("en-IN")}</td><td className="p-4">{product.stock}</td><td className="p-4"><button onClick={() => setEditing(product)} className="mr-3 underline">Edit</button><button onClick={() => void toggle(product)} className="underline">{product.published ? "Hide" : "Publish"}</button></td></tr>)}</tbody></table></section>
      <form key={editing?.slug ?? "new"} onSubmit={create} className="border border-[#e8e1d8] bg-[#fbf8f3] p-5"><h2 className="font-display text-3xl">{editing ? "Edit this scent" : "Add a scent"}</h2>{[["name","Name"],["slug","Slug (e.g. rosewood-fig)"],["category","Collection"],["scent","Scent family"],["size","Size"],["burnTime","Burn time"],["price","Price (₹)"],["stock","Stock"],["image","Image URL or Unsplash ID"]].map(([name,label]) => <label key={name} className="mt-3 block text-[10px]">{label}<input required={name !== "image"} name={name} defaultValue={editing ? String(editing[name as keyof AdminProduct] ?? "") : ""} disabled={name === "slug" && !!editing} className="mt-1 w-full border border-[#ded5cb] bg-white px-3 py-2 text-xs outline-none disabled:bg-[#f1ebe3]" /></label>)}<label className="mt-3 block text-[10px]">Or upload product image <input name="file" type="file" accept="image/*" className="mt-1 w-full text-xs" /></label><label className="mt-3 block text-[10px]">Description<textarea required name="description" defaultValue={editing?.description ?? ""} className="mt-1 w-full border border-[#ded5cb] bg-white px-3 py-2 text-xs outline-none" /></label>{message && <p role="status" className="mt-3 text-xs">{message}</p>}<button disabled={busy} className="btn-primary mt-4 w-full">{busy ? "Saving…" : editing ? "Save changes" : "Create product"}</button>{editing && <button type="button" onClick={() => { setEditing(null); setMessage(""); }} className="mt-3 w-full text-xs underline">Cancel edit</button>}</form>
    </div></div>;
}
