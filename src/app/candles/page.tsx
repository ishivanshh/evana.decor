import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { candleImages } from "@/lib/brand-images";
import { productImage, products } from "@/lib/catalog";

export const metadata = { title: "Handcrafted candles", description: "Explore Evana's complete collection of handcrafted candles." };

const imageDirectories = [
  { directory: path.join(process.cwd(), "public", "collection", "photos"), urlPrefix: "/collection/photos" },
];

const galleryImages = imageDirectories.flatMap(({ directory, urlPrefix }) => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true })
    .filter(entry => entry.isFile() && /\.(avif|gif|jpe?g|png|webp)$/i.test(entry.name))
    .sort((left, right) => left.name.localeCompare(right.name))
    .map(entry => {
      const src = `${urlPrefix}/${encodeURIComponent(entry.name)}`;
      const knownImage = candleImages.find(image => image.src === src);
      const name = entry.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\b\w/g, letter => letter.toUpperCase());
      return { src, alt: knownImage?.alt ?? `Evana handcrafted candle: ${name}`, name: knownImage?.name ?? name };
    });
});

export default function CandlesPage() {
  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Poured and finished by hand</p>
        <h1 className="font-display mt-3 text-6xl">The candle collection</h1>
        <p className="mt-4 text-sm leading-7 text-[#82776d]">Every candle is a small-batch original. Browse each piece from the Evana candle collection.</p>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {galleryImages.map(image => {
          const product = products.find(item => productImage(item.image) === image.src && item.category !== "Wax bars");
          const card = (
            <>
              <div className="relative aspect-[.76] overflow-hidden bg-[#eee7dd]">
                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <h2 className="font-display mt-3 text-xl">{product?.name ?? image.name}</h2>
              {product && <p className="mt-1 text-xs text-[#82776d]">₹{product.price.toLocaleString("en-IN")}</p>}
            </>
          );

          return product ? (
            <Link href={`/products/${product.slug}`} key={image.src} className="group">{card}</Link>
          ) : (
            <div key={image.src} className="group">{card}</div>
          );
        })}
      </div>
    </div>
  );
}
