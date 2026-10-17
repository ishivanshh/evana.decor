import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const diwaliDirectory = path.join(process.cwd(), "public", "categories", "diwali");
const availableDiwaliImages = existsSync(diwaliDirectory)
  ? readdirSync(diwaliDirectory, { withFileTypes: true })
      .filter(entry => entry.isFile() && /\.(avif|gif|jpe?g|png|webp)$/i.test(entry.name))
      .sort((left, right) => left.name.localeCompare(right.name))
      .map(entry => ({
        src: `/categories/diwali/${encodeURIComponent(entry.name)}`,
        alt: entry.name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, letter => letter.toUpperCase()),
      }))
  : [];
const verticalDiwaliImage = availableDiwaliImages.find(image => image.src.endsWith("/vertical.jpg"));
const diwaliImages = [
  ...(verticalDiwaliImage ? [verticalDiwaliImage] : []),
  ...availableDiwaliImages.filter(image => image !== verticalDiwaliImage).slice(0, verticalDiwaliImage ? 4 : 5),
];

export function DiwaliCollection() {
  return (
    <section className="container-page py-10 sm:py-14" aria-labelledby="diwali-heading">
      <div className="border border-[#d8cec3] bg-[#fbf8f3] p-4 sm:p-7 md:p-9">
        <div className="border border-[#d8cec3] px-4 py-6 text-center sm:px-8">
          <p className="eyebrow">A season of light, made by hand</p>
          <h2 id="diwali-heading" className="font-display mt-2 text-4xl leading-tight sm:text-5xl">
            Diwali collection is here
          </h2>
          <p className="mt-2 text-sm text-[#71665d]">This Diwali, bring Evana home.</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {diwaliImages.map((image, index) => (
            <div key={image.src} className={`relative overflow-hidden bg-[#e8e1d8] ${index === 0 && verticalDiwaliImage ? "aspect-[.72] md:row-span-2 md:aspect-auto" : "aspect-square"}`}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition duration-700 hover:scale-[1.03]"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="/candle/diwali" className="btn-primary">
            Explore the Diwali collection <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
