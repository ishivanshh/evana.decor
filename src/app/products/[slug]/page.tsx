import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { products, productImage } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { ProductPurchase } from "@/components/product-purchase";
import { ReviewSection } from "@/components/review-section";
import { connectDB } from "@/lib/db";
import { ProductModel } from "@/lib/models";
import type { Product } from "@/lib/catalog";

export const dynamic = "force-dynamic";
async function getProduct(slug: string): Promise<Product | undefined> {
  await connectDB();
  const record = await ProductModel.findOne({ slug, published: true }).lean();
  return record ? {
    _id: String(record._id), name: record.name, slug: record.slug, category: record.category, scent: record.scent,
    description: record.description, notes: record.notes, burnTime: record.burnTime, size: record.size,
    price: record.price, compareAt: record.compareAt, image: record.image, rating: record.rating, badge: record.badge,
  } : undefined;
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product?.name ?? "Product", description: product?.description };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  return <>
    <div className="container-page py-5 text-[10px] text-[#82776d]"><Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {product.name}</div>
    <section className="container-page grid gap-10 pb-20 md:grid-cols-[1.05fr_.95fr] md:gap-16">
      <div className="relative aspect-[.88] overflow-hidden bg-[#eee7dd]"><Image src={productImage(product.image, 1300)} alt={product.name} fill priority sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" /></div>
      <div className="py-3 md:py-10">
        <p className="eyebrow">{product.category}</p><h1 className="font-display mt-4 text-5xl md:text-6xl">{product.name}</h1>
        <div className="mt-4 flex items-center gap-2"><div className="flex text-[#a85f45]"><Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/></div><span className="text-xs text-[#82776d]">{product.rating} · 24 reviews</span></div>
        <p className="mt-6 text-lg">₹{product.price.toLocaleString("en-IN")}</p><p className="mt-5 text-sm leading-7 text-[#71665d]">{product.description}</p>
        <div className="mt-8 border-y border-[#e8e1d8] py-5"><p className="eyebrow">The fragrance</p><div className="mt-3 flex flex-wrap gap-2">{product.notes.map(note => <span className="bg-[#f1ebe3] px-3 py-2 text-xs" key={note}>{note}</span>)}</div></div>
        <div className="grid grid-cols-2 border-b border-[#e8e1d8] py-5 text-sm"><div><span className="text-xs text-[#82776d]">Size</span><p className="mt-1">{product.size}</p></div><div><span className="text-xs text-[#82776d]">Burn time</span><p className="mt-1">{product.burnTime}</p></div></div>
        <ProductPurchase product={product} />
        <p className="mt-5 text-center text-[10px] text-[#82776d]">Thoughtfully packed · Cash on delivery available</p>
        <details className="mt-8 border-t border-[#e8e1d8] py-4"><summary className="cursor-pointer text-xs uppercase tracking-widest">Candle care</summary><p className="mt-4 text-sm leading-6 text-[#71665d]">On the first burn, let the wax melt to the edge of the vessel. Trim the wick to 5 mm before every use, and never leave a lit candle unattended.</p></details>
      </div>
    </section>
    <section className="bg-[#f1ebe3] py-16"><div className="container-page"><h2 className="font-display mb-8 text-4xl">You may also love</h2><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{products.filter(item => item.slug !== product.slug).slice(0, 4).map(item => <ProductCard product={item} key={item._id} />)}</div></div></section>
    <ReviewSection slug={product.slug} />
  </>;
}
