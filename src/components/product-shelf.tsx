"use client";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { products, type Product } from "@/lib/catalog";
export function ProductShelf() {
  const [items, setItems] = useState(products.slice(0, 4));
  useEffect(() => {
    let active = true;
    fetch("/api/products").then(async response => {
      if (!response.ok) throw new Error("Catalog unavailable.");
      const data = await response.json();
      if (active && Array.isArray(data.products)) {
        const featured = (data.products as Product[]).filter(product => product.published !== false).sort((a, b) => b.rating - a.rating).slice(0, 4);
        if (featured.length) setItems(featured);
      }
    }).catch(error => console.error("Unable to load the live featured collection:", error));
    return () => { active = false; };
  }, []);
  return <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">{items.map(product => <ProductCard product={product} key={product._id} />)}</div>;
}
