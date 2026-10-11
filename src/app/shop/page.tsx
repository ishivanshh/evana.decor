"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";

export default function ShopPage() {
  const [category, setCategory] = useState("All");
  const [scent, setScent] = useState("All");
  const [size, setSize] = useState("All");
  const [price, setPrice] = useState("all");
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  const [catalog, setCatalog] = useState(products);
  const [catalogError, setCatalogError] = useState("");
  useEffect(() => {
    let active = true;
    fetch("/api/products").then(async response => {
      if (!response.ok) throw new Error("The live collection is temporarily unavailable.");
      const result = await response.json();
      if (active && Array.isArray(result.products)) setCatalog(result.products);
    }).catch(() => { if (active) setCatalogError("Showing our sample collection while the live shop reconnects."); });
    return () => { active = false; };
  }, []);
  const filtered = useMemo(() => catalog.filter(product =>
    (category === "All" || product.category === category) &&
    (scent === "All" || product.scent === scent) &&
    (size === "All" || product.size === size) &&
    (price === "all" || (price === "under-500" ? product.price < 500 : price === "500-700" ? product.price >= 500 && product.price <= 700 : product.price > 700)) &&
    `${product.name} ${product.description} ${product.notes.join(" ")}`.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : 0), [catalog, category, scent, size, price, sort, search]);
  return <div className="container-page pb-24">
    <div className="py-14 text-center md:py-20"><p className="eyebrow">The Evana collection</p><h1 className="font-display mt-3 text-6xl">Find your <i>glow.</i></h1><p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#82776d]">Small-batch candles to make ordinary moments feel a little more yours.</p></div>
    <div className="flex flex-col justify-between gap-4 border-y border-[#e8e1d8] py-4 sm:flex-row sm:items-center">
      <div className="flex flex-wrap gap-2">
        <select aria-label="Category filter" value={category} onChange={event => setCategory(event.target.value)} className="border border-[#e8e1d8] bg-transparent px-3 py-2 text-xs"><option>All</option>{Array.from(new Set(catalog.map(product => product.category))).map(value => <option key={value}>{value}</option>)}</select>
        <select aria-label="Scent filter" value={scent} onChange={event => setScent(event.target.value)} className="border border-[#e8e1d8] bg-transparent px-3 py-2 text-xs"><option>All</option>{Array.from(new Set(catalog.map(product => product.scent))).map(value => <option key={value}>{value}</option>)}</select>
        <select aria-label="Size filter" value={size} onChange={event => setSize(event.target.value)} className="border border-[#e8e1d8] bg-transparent px-3 py-2 text-xs"><option value="All">All sizes</option>{Array.from(new Set(catalog.map(product => product.size))).map(value => <option key={value}>{value}</option>)}</select>
        <select aria-label="Price filter" value={price} onChange={event => setPrice(event.target.value)} className="border border-[#e8e1d8] bg-transparent px-3 py-2 text-xs"><option value="all">Any price</option><option value="under-500">Under ₹500</option><option value="500-700">₹500–₹700</option><option value="over-700">Over ₹700</option></select>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 border-b border-[#cbbcaf]"><Search size={14} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search scents" className="w-32 bg-transparent py-2 text-xs outline-none sm:w-44" /></label>
        <select aria-label="Sort products" value={sort} onChange={event => setSort(event.target.value)} className="bg-transparent text-xs"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select>
      </div>
    </div>
    {catalogError && <p role="status" className="mt-4 text-xs text-[#82776d]">{catalogError}</p>}<p className="py-5 text-[10px] uppercase tracking-widest text-[#82776d]">{filtered.length} pieces to love</p>
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-7 lg:grid-cols-4">{filtered.map(product => <ProductCard product={product} key={product._id} />)}</div>
    {filtered.length === 0 && <p className="py-20 text-center font-display text-3xl">No scents found. Try another search.</p>}
  </div>;
}
