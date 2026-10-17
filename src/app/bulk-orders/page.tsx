import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { BulkOrderContact } from "@/components/bulk-order-contact";
import { BulkOrderReviews } from "@/components/bulk-order-reviews";
import { NumberTicker } from "@/components/ui/number-ticker";
import { candleImages } from "@/lib/brand-images";

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
      <section className="bg-[#f1ebe3] px-5 py-16 text-center sm:py-24">
        <p className="eyebrow">Made to make an impression</p>
        <h1 className="font-display mx-auto mt-4 max-w-3xl text-5xl leading-[.98] sm:text-7xl">
          Little lights, <i>made for many.</i>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#71665d]">
          Thoughtful candles for celebrations, thoughtful gifting, and the moments you want to make your own.
        </p>
        <div className="mx-auto mt-9 flex max-w-xl flex-col items-stretch justify-center gap-5 border-y border-[#d8cec3] py-5 sm:flex-row sm:items-center sm:gap-0">
          <div className="flex flex-1 flex-col items-center px-8">
            <div className="flex items-baseline font-display text-6xl text-[#4a3a31] sm:text-7xl">
              <NumberTicker value={1000} startValue={0} className="!text-[#4a3a31]" />
              <span>+</span>
            </div>
            <p className="mt-1 text-[10px] uppercase tracking-[.2em] text-[#82776d]">Total orders</p>
          </div>
          <div className="hidden h-16 w-px bg-[#d8cec3] sm:block" />
          <div className="flex flex-1 flex-col items-center border-t border-[#d8cec3] px-8 pt-5 sm:border-l-0 sm:border-t-0 sm:pt-0">
            <NumberTicker value={202} startValue={0} className="!text-[#4a3a31]" />
            <p className="mt-1 text-[10px] uppercase tracking-[.2em] text-[#82776d]">Bulk orders</p>
          </div>
        </div>
        <div className="mt-8">
          <a href="#moments" aria-label="Discover bulk order ideas" className="inline-flex rounded-full border border-[#d8cec3] p-3 text-[#a85f45] transition hover:bg-white">
            <ArrowDown size={17} />
          </a>
        </div>
      </section>

      <section id="moments" className="container-page py-16 sm:py-20">
        <div className="mb-8 max-w-lg">
          <p className="eyebrow">A little something, made personal</p>
          <h2 className="font-display mt-3 text-4xl sm:text-5xl">For every kind of gathering.</h2>
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          {[candleImages[5], candleImages[16], candleImages[17]].map(image => (
            <div key={image.src} className="relative aspect-[1.2] min-w-0 flex-1 overflow-hidden bg-[#e8e1d8]">
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 hover:scale-[1.03]" />
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
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          {bulkOrderVideos.map(video => (
            <div key={video.src} className="min-w-0 flex-1 basis-[calc(50%-0.5rem)] overflow-hidden bg-[#eee7dd]">
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
                className="aspect-[.72] h-full w-full object-cover"
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
