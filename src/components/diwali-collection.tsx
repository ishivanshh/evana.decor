import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const diwaliDirectory = path.join(process.cwd(), "public", "diwali");
const diwaliImages = existsSync(diwaliDirectory)
  ? readdirSync(diwaliDirectory, { withFileTypes: true })
      .filter(entry => entry.isFile() && /\.(avif|gif|jpe?g|png|webp)$/i.test(entry.name))
      .sort((left, right) => left.name.localeCompare(right.name))
      .map(entry => ({
        src: `/diwali/${entry.name}`,
        alt: entry.name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, letter => letter.toUpperCase()),
      }))
  : [];

function ComingSoonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`flex min-h-40 flex-1 flex-col items-center justify-center border border-dashed border-[#b7a99c] bg-[#f1ebe3] p-5 text-center text-[#71665d] ${className}`}>
      <Sparkles size={18} strokeWidth={1.3} className="text-[#a85f45]" />
      <p className="font-display mt-3 text-2xl">More coming soon</p>
      <p className="mt-1 text-[9px] uppercase tracking-[.16em]">A little more Diwali magic is on its way</p>
    </div>
  );
}

export function DiwaliCollection() {
  const [featuredImage, ...moreImages] = diwaliImages;

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

        <div className="mt-5 flex flex-col gap-4 md:flex-row">
          <div className="relative aspect-[.78] min-h-[320px] overflow-hidden bg-[#e8e1d8] md:w-1/3">
            {featuredImage ? (
              <Image
                src={featuredImage.src}
                alt={featuredImage.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-700 hover:scale-[1.03]"
              />
            ) : (
              <ComingSoonCard className="h-full" />
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {moreImages.length > 0 ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                {moreImages.map(image => (
                  <div key={image.src} className="relative aspect-[1.45] min-h-40 min-w-0 flex-1 overflow-hidden bg-[#e8e1d8]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 66vw"
                      className="object-cover transition duration-700 hover:scale-[1.03]"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <ComingSoonCard className="min-h-48" />
            )}
            <div className="flex flex-col gap-4 sm:flex-row">
              <ComingSoonCard />
              <ComingSoonCard />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/candles" className="btn-primary">
            Explore the Diwali collection <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
