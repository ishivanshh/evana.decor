import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Camera, Heart } from "lucide-react";
import { candleImages } from "@/lib/brand-images";
import { InstagramReel } from "@/components/instagram-reel";

export const metadata: Metadata = {
  title: "Follow Evana on Instagram",
  description:
    "Find Evana candles on Instagram for updates, new candles, and behind-the-scenes moments.",
};

const reelUrls = [
  "https://www.instagram.com/reel/DU8IW69Enp5/",
  "https://www.instagram.com/reel/DcVz9S3N40d/",
  "https://www.instagram.com/reel/DdjXWenT7Bq/",
  "https://www.instagram.com/reel/DdWSxHcTk1b/",
];

export default function InstagramPage() {
  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow text-center">A slower scroll</p>
        <h1 className="font-display mt-3 text-center text-6xl">
          Little moments, with Evana.
        </h1>
        <div className="mt-10 overflow-hidden border border-[#e8e1d8] bg-[#f1ebe3]">
          <div className="relative aspect-[16/9] bg-[#0a0a0a]">
            <Image
              src="/insta.jpg"
              alt="Evana candles Instagram profile"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 900px"
              className="object-contain"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-7">
            <div>
              <p className="eyebrow">Find us on Instagram</p>
              <h2 className="font-display mt-1 text-3xl">@evana_candles</h2>
              <p className="mt-1 text-xs text-[#82776d]">
                Lighting of love and comfort, one candle at a time.
              </p>
            </div>
            <Link
              href="https://www.instagram.com/evana_candles/"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              <Camera size={15} /> Follow on Instagram{" "}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
      <section className="mt-16">
        <div className="mb-7 text-center">
          <p className="eyebrow">Short, sweet, and made in our studio</p>
          <h2 className="font-display mt-2 text-4xl">Reels from Evana</h2>
          <p className="mt-3 text-sm text-[#82776d]">
            A little look at the candles and moments behind the brand.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {candleImages.slice(0, 4).map((image, index) => (
            <InstagramReel
              key={reelUrls[index]}
              url={reelUrls[index]}
              poster={image}
            />
          ))}
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-2xl border-t border-[#e8e1d8] pt-10 text-center">
        <Heart className="mx-auto text-[#a85f45]" size={20} strokeWidth={1.4} />
        <h2 className="font-display mt-4 text-4xl">
          For updates and connection, follow us.
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#82776d]">
          Every follow, kind word, and share supports our small candle studio.
          Thank you for helping Evana glow.
        </p>
        <Link
          href="https://www.instagram.com/evana_candles/"
          target="_blank"
          rel="noreferrer"
          className="btn-outline mt-6"
        >
          Follow and show your support <ArrowUpRight size={14} />
        </Link>
      </section>
    </div>
  );
}
