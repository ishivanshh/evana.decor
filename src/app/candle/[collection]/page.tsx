import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/lib/catalog";

const collections = {
  jute: { title: "Jute candles", directories: ["categories/jute"] },
  gulban: { title: "Gulban candles", directories: ["categories/gulban"] },
  diwali: { title: "Diwali candles", directories: ["categories/diwali"] },
  valentines: { title: "Valentine's candles", directories: ["categories/valentine"] },
  christmas: { title: "Christmas candles", directories: ["categories/christmas"] },
  ocean: { title: "Ocean candles", directories: ["categories/ocean"] },
} as const;

type CollectionSlug = keyof typeof collections;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection } = await params;
  if (!Object.hasOwn(collections, collection)) return { title: "Candle collection" };
  return { title: collections[collection as CollectionSlug].title };
}

export default async function CandleCollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  if (!Object.hasOwn(collections, collection)) notFound();

  const selectedCollection = collections[collection as CollectionSlug];
  const imageFiles = selectedCollection.directories.flatMap(relativeDirectory => {
    const absoluteDirectory = path.join(process.cwd(), "public", relativeDirectory);
    if (!existsSync(absoluteDirectory)) return [];

    return readdirSync(absoluteDirectory, { withFileTypes: true })
      .filter(entry => entry.isFile() && /\.(avif|gif|jpe?g|png|webp)$/i.test(entry.name))
      .map(entry => ({
        src: `/${relativeDirectory}/${encodeURIComponent(entry.name)}`,
        name: entry.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\b\w/g, letter => letter.toUpperCase()),
      }));
  });
  const images = [...new Map(imageFiles.map(image => [image.src, image])).values()];

  return (
    <main className="container-page min-h-[60vh] py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Poured and finished by hand</p>
        <h1 className="font-display mt-3 text-6xl">{selectedCollection.title}</h1>
        <p className="mt-4 text-sm leading-7 text-[#82776d]">
          Discover the Evana candles in our {selectedCollection.title.replace(/ candles$/i, "")} collection.
        </p>
      </div>
      {images.length > 0 ? (
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {images.map(image => {
            const product = products.find(item => item.image === image.src && item.category !== "Wax bars");
            const card = (
              <>
                <div className="relative aspect-[.76] overflow-hidden bg-[#eee7dd]">
                  <Image
                    src={image.src}
                    alt={image.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <h2 className="font-display mt-3 text-xl">{product?.name ?? image.name}</h2>
                {product && <p className="mt-1 text-xs text-[#82776d]">₹{product.price.toLocaleString("en-IN")}</p>}
              </>
            );

            return product ? (
              <Link key={image.src} href={`/products/${product.slug}`} className="group">{card}</Link>
            ) : (
              <div key={image.src} className="group">{card}</div>
            );
          })}
        </div>
      ) : (
        <p className="mt-12 text-center text-sm text-[#82776d]">
          This collection is being prepared. New pieces will appear here soon.
        </p>
      )}
    </main>
  );
}
