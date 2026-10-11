import Image from "next/image";
import { waxbarImages } from "@/lib/brand-images";
export const metadata = { title: "Wax bars", description: "Discover Evana's hand-poured wax bars for home fragrance warmers." };
export default function WaxbarsPage() {
  return <div className="container-page min-h-[65vh] py-14"><div className="mx-auto max-w-2xl text-center"><p className="eyebrow">Small melts, lovely moments</p><h1 className="font-display mt-3 text-6xl">Wax bars</h1><p className="mt-4 text-sm leading-7 text-[#82776d]">A little fragrance, ready for your favourite warmer. More wax-bar designs are on their way.</p></div><div className="mt-12 grid gap-6 sm:grid-cols-2">{waxbarImages.map(image => <article key={image.src} className="group"><div className="relative aspect-[1.1] overflow-hidden bg-[#eee7dd]"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" /></div><h2 className="font-display mt-4 text-3xl">{image.name}</h2><p className="mt-2 text-sm text-[#82776d]">Handcrafted in small batches. Product details and ordering options coming soon.</p></article>)}</div></div>;
}
