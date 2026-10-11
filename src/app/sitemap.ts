import type { MetadataRoute } from "next";
import { products } from "@/lib/catalog";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticRoutes = ["", "/shop", "/about", "/contact", "/faq", "/shipping", "/privacy", "/terms", "/track-order"];
  return [...staticRoutes.map(route => ({ url: `${base}${route}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: route === "" ? 1 : 0.6 })), ...products.map(product => ({ url: `${base}/products/${product.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 }))];
}
