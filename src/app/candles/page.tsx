import Image from "next/image";
import Link from "next/link";
import { candleImages } from "@/lib/brand-images";
import { products } from "@/lib/catalog";
export const metadata = { title: "Handcrafted candles", description: "Explore Evana's complete collection of handcrafted candles." };
export default function CandlesPage() {
  return <div className="container-page py-14"><div className="mx-auto max-w-2xl text-center"><p className="eyebrow">Poured and finished by hand</p><h1 className="font-display mt-3 text-6xl">The candle collection</h1><p className="mt-4 text-sm leading-7 text-[#82776d]">Every candle is a small-batch original. Browse each piece from the Evana candle collection.</p></div><div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{candleImages.map((image, index) => { const product = products[index % products.length]; return <Link href={`/products/${product.slug}`} key={image.src} className="group"><div className="relative aspect-[.76] overflow-hidden bg-[#eee7dd]"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" className="object-cover transition duration-700 group-hover:scale-105" /></div><h2 className="font-display mt-3 text-xl">{image.name}</h2><p className="mt-1 text-xs text-[#82776d]">{product.name} · ₹{product.price.toLocaleString("en-IN")}</p></Link>; })}</div></div>;
}
