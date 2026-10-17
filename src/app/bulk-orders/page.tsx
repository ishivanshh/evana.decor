import type { Metadata } from "next";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { BulkOrderContact } from "@/components/bulk-order-contact";
import { BulkOrderReviews } from "@/components/bulk-order-reviews";
import { NumberTicker } from "@/components/ui/number-ticker";

const hampersDirectory = path.join(process.cwd(), "public", "categories", "hampers");
const hamperImages = existsSync(hampersDirectory)
  ? readdirSync(hampersDirectory, { withFileTypes: true })
      .filter(entry => entry.isFile() && /\.(avif|gif|jpe?g|png|webp)$/i.test(entry.name))
      .sort((left, right) => left.name.localeCompare(right.name))
      .map(entry => ({
        src: `/categories/hampers/${encodeURIComponent(entry.name)}`,
        alt: entry.name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, letter => letter.toUpperCase()),
      }))
  : [];

const bulkOrderVideos = [
  { src: "/orders/order1.mp4", title: "Evana bulk order video 1" },
  { src: "/orders/orders2.mp4", title: "Evana bulk order video 2" },
  { src: "/orders/orders3.mp4", title: "Evana bulk order video 3" },
  { src: "/orders/orders4.mp4", title: "Evana bulk order video 4" },
];

export const metadata: Metadata = {
  title: "Bulk orders & customisation",
  description: "Create thoughtful candle gifts and customised bulk orders with Evana.",
};

export default function BulkOrdersPage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden bg-[#30241c] px-5 py-14 text-white sm:py-20">
        <video
          src="/background%20bulk.mp4"
          aria-hidden="true"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[#30241c]/65" />
        <div className="container-page flex flex-col items-center gap-8 md:flex-row md:justify-between md:gap-12">
          <div className="max-w-2xl text-center md:text-left">
            <p className="eyebrow !text-[#e6b99e]">Made to make an impression</p>
            <h1 className="font-display mt-4 text-5xl leading-[.98] sm:text-7xl">
              Little lights, <i>made for many.</i>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/85 md:mx-0">
              Thoughtful candles for celebrations, thoughtful gifting, and the moments you want to make your own.
            </p>
            <div className="mx-auto mt-8 flex max-w-xl flex-col items-stretch justify-center gap-4 border-y border-white/40 py-5 sm:flex-row sm:items-center sm:gap-0 md:mx-0">
              <div className="flex flex-1 flex-col items-center px-8">
                <div className="flex items-baseline font-display text-5xl sm:text-6xl">
                  <NumberTicker value={1000} startValue={0} className="!text-white" />
                  <span>+</span>
                </div>
                <p className="mt-1 text-[10px] uppercase tracking-[.2em] text-white/75">Total orders</p>
              </div>
              <div className="hidden h-14 w-px bg-white/40 sm:block" />
              <div className="flex flex-1 flex-col items-center border-t border-white/40 px-8 pt-4 sm:border-t-0 sm:pt-0">
                <div className="font-display text-5xl sm:text-6xl">
                  <NumberTicker value={202} startValue={0} className="!text-white" />
                </div>
                <p className="mt-1 text-[10px] uppercase tracking-[.2em] text-white/75">Bulk orders</p>
              </div>
            </div>
            <a href="#moments" aria-label="Discover bulk order ideas" className="mt-6 inline-flex rounded-full border border-white/60 p-3 text-white transition hover:bg-white hover:text-[#4a3a31]">
              <ArrowDown size={17} />
            </a>
          </div>
        </div>
      </section>

      <section id="moments" className="container-page py-16 sm:py-20">
        <div className="mb-8 max-w-lg">
          <p className="eyebrow">A little something, made personal</p>
          <h2 className="font-display mt-3 text-4xl sm:text-5xl">Hampers we have delivered till now</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 md:min-h-[480px] md:grid-cols-[.8fr_1.8fr] md:grid-rows-2 md:gap-4 lg:min-h-[560px]">
          <div className="relative aspect-[.8] overflow-hidden bg-[#30241c] md:row-span-2 md:aspect-auto">
            <video
              src="/categories/hampers/reel1.mp4"
              aria-label="Evana hamper gifts"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={hamperImages[0]?.src}
              className="h-full w-full object-contain"
            />
          </div>
          {hamperImages.slice(1, 2).map(image => (
            <div key={image.src} className="relative aspect-[1.8] overflow-hidden bg-[#e8e1d8] md:row-span-2 md:aspect-auto">
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover transition duration-700 hover:scale-[1.03]" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#fbf8f3] py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Kind words, warm hearts</p>
            <h2 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">
              Our customers’ complaints—we love receiving them.
            </h2>
          </div>
          <BulkOrderReviews />
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="mb-8 text-center">
          <p className="eyebrow">A little behind the scenes</p>
          <h2 className="font-display mt-3 text-4xl sm:text-5xl">Evana on the go</h2>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4">
          {bulkOrderVideos.map(video => (
            <div key={video.src} className="min-w-0 overflow-hidden bg-[#30241c]">
              <video
                src={video.src}
                title={video.title}
                aria-label={video.title}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/orders/main.jpg"
                className="aspect-[.7] h-auto w-full object-contain sm:aspect-[.75]"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#4a3a31] px-5 py-16 text-center text-[#f8f3ed] sm:py-20">
        <Sparkles className="mx-auto text-[#d3a38a]" size={20} strokeWidth={1.4} />
        <p className="eyebrow mt-4 !text-[#d3a38a]">Made for your moment</p>
        <h2 className="font-display mx-auto mt-3 max-w-3xl text-4xl leading-tight sm:text-5xl">
          We love bulk orders and customisation.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#d6ccc3]">
          Tell us what you are celebrating and we will help you create something personal. Just message us on WhatsApp or Instagram.
        </p>
        <BulkOrderContact />
        <Link href="/candles" className="mt-7 inline-flex items-center gap-2 text-[10px] uppercase tracking-[.16em] text-[#d6ccc3] transition hover:text-white">
          Explore the candle collection <ArrowRight size={14} />
        </Link>
      </section>
    </div>
  );
}
