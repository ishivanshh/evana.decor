import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { productImage, products as sampleProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { ProductPurchase } from "@/components/product-purchase";
import { ReviewSection } from "@/components/review-section";
import { connectDB } from "@/lib/db";
import { ProductModel } from "@/lib/models";
import type { Product } from "@/lib/catalog";

export const dynamic = "force-dynamic";
function toProduct(record: Record<string, unknown>): Product {
  return {
    _id: String(record._id), name: String(record.name), slug: String(record.slug), category: String(record.category),
    scent: String(record.scent), description: String(record.description), notes: record.notes as string[],
    burnTime: String(record.burnTime), size: String(record.size), price: Number(record.price),
    compareAt: record.compareAt ? Number(record.compareAt) : undefined, image: String(record.image),
    rating: Number(record.rating), badge: typeof record.badge === "string" ? record.badge : undefined,
  };
}
async function getProduct(slug: string): Promise<Product | undefined> {
  try {
    await connectDB();
    const record = await ProductModel.findOne({ slug }).lean();
    if (record) return record.published ? toProduct(record as unknown as Record<string, unknown>) : undefined;
    return sampleProducts.find(product => product.slug === slug);
  } catch (error) {
    const sampleProduct = sampleProducts.find(item => item.slug === slug);
    if (!sampleProduct) throw error;
    console.error(`Using sample catalog details for ${slug} because the product database could not be reached:`, error);
    return sampleProduct;
  }
}

async function getRecommendations(product: Product, count: number): Promise<Product[]> {
  let databaseProducts: Product[] = [];
  try {
    const records = await ProductModel.find({ published: true, slug: { $ne: product.slug } }).limit(100).lean();
    databaseProducts = records.map(record => toProduct(record as unknown as Record<string, unknown>));
  } catch (error) {
    console.error(`Unable to load live recommendations for ${product.slug}; using the sample catalog:`, error);
  }
  const candidatesBySlug = new Map<string, Product>();
  for (const candidate of [...databaseProducts, ...sampleProducts]) {
    if (candidate.slug !== product.slug && candidate.published !== false) candidatesBySlug.set(candidate.slug, candidate);
  }
  return [...candidatesBySlug.values()]
    .map(candidate => ({
      product: candidate,
      similarity: Number(candidate.category === product.category) * 2 + Number(candidate.scent === product.scent),
      random: Math.random(),
    }))
    .sort((left, right) => right.similarity - left.similarity || left.random - right.random)
    .slice(0, count)
    .map(entry => entry.product);
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
  const recommendationCount = Math.random() < 0.5 ? 5 : 6;
  const recommendations = await getRecommendations(product, recommendationCount);
  return <>
    <div className="container-page py-5 text-[10px] text-[#82776d]"><Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {product.name}</div>
    <section className="container-page grid gap-10 pb-20 md:grid-cols-[1.05fr_.95fr] md:gap-16">
      <div className="relative aspect-[.88] overflow-hidden bg-[#eee7dd]"><Image src={productImage(product.image, 1300)} alt={product.name} fill priority sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" /></div>
      <div className="py-3 md:py-10">
        <p className="eyebrow">{product.category}</p><h1 className="font-display mt-4 text-5xl md:text-6xl">{product.name}</h1>
        <div className="mt-4 flex items-center gap-2"><div className="flex text-[#a85f45]"><Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/></div><span className="text-xs text-[#82776d]">{product.rating} · 24 reviews</span></div>
        <p className="mt-6 text-lg">₹{product.price.toLocaleString("en-IN")}</p><p className="mt-5 text-sm leading-7 text-[#71665d]">{product.description}</p>
        <div className="mt-8 border-y border-[#e8e1d8] py-5"><p className="eyebrow">The fragrance</p><div className="mt-3 flex flex-wrap gap-2">{product.notes.map(note => <span className="bg-[#f1ebe3] px-3 py-2 text-xs" key={note}>{note}</span>)}</div></div>
        <div className="grid grid-cols-2 border-b border-[#e8e1d8] py-5 text-sm"><div><span className="text-xs text-[#82776d]">Size</span><p className="mt-1">{product.size}</p></div><div><span className="text-xs text-[#82776d]">{product.category === "Wax bars" ? "Designed for" : "Burn time"}</span><p className="mt-1">{product.burnTime}</p></div></div>
        <ProductPurchase product={product} />
        <p className="mt-5 text-center text-[10px] text-[#82776d]">Thoughtfully packed · Cash on delivery available</p>
        <details className="mt-8 border-t border-[#e8e1d8] py-4"><summary className="cursor-pointer text-xs uppercase tracking-widest">{product.category === "Wax bars" ? "Wax bar care" : "Candle care"}</summary><p className="mt-4 text-sm leading-6 text-[#71665d]">{product.category === "Wax bars" ? "Break off a piece and use it with a wax warmer, following the warmer manufacturer's instructions. Do not add water or leave a warmer unattended." : "On the first burn, let the wax melt to the edge of the vessel. Trim the wick to 5 mm before every use, and never leave a lit candle unattended."}</p></details>
      </div>
    </section>
    {recommendations.length > 0 && <section className="bg-[#f1ebe3] py-16"><div className="container-page"><p className="eyebrow">Chosen to complement</p><h2 className="font-display mb-8 mt-2 text-4xl">You may also love</h2><div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">{recommendations.map(item => <ProductCard product={item} key={item._id} />)}</div></div></section>}
    <ReviewSection slug={product.slug} />
  </>;
}
