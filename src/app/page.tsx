import Image from "next/image";
import Link from "next/link";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { ArrowRight, Leaf, PackageCheck, Sparkles } from "lucide-react";
import { EventSlider } from "@/components/event-slider";
import { DiwaliCollection } from "@/components/diwali-collection";
import { ProductShelf } from "@/components/product-shelf";
import { Reveal } from "@/components/reveal";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { candleImages, waxbarImages } from "@/lib/brand-images";
import { products } from "@/lib/catalog";

const eventDirectory = path.join(process.cwd(), "public", "event");
const eventPhotos = existsSync(eventDirectory)
  ? readdirSync(eventDirectory, { withFileTypes: true })
      .filter(entry => entry.isFile() && /\.(avif|gif|jpe?g|png|webp)$/i.test(entry.name))
      .sort((left, right) => left.name.localeCompare(right.name))
      .slice(0, 5)
      .map((entry, index) => ({ src: `/event/${entry.name}`, alt: `Evana at a Delhi pop-up event, photo ${index + 1}` }))
  : [];

export default function Home() {
  return <>
    <section className="relative min-h-[620px] overflow-hidden bg-[#d9c8b4] md:min-h-[720px]">
      <Image src="/home/evana-home-hero.jpg" alt="A softly lit Evana candle at home" fill priority sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#30241c]/65 via-[#30241c]/25 to-transparent" />
      <div className="container-page relative flex min-h-[620px] items-center md:min-h-[720px]">
        <Reveal className="max-w-xl py-20 text-[#fffaf5]">
          <p className="eyebrow !text-[#ead0b8]">A softer kind of everyday</p>
          <h1 className="font-display mt-6 text-6xl leading-[.98] md:text-8xl">Come home<br />to a slower<br /><i>glow.</i></h1>
          <p className="mt-7 max-w-sm text-sm leading-7 text-white/85">Hand-poured soy candles, made in small batches for the moments that make a house feel like yours.</p>
          <Link href="/candles" className="mt-9 inline-flex items-center gap-3 border border-white/75 px-6 py-4 text-[10px] uppercase tracking-[.18em] transition hover:bg-white hover:text-[#382b23]">Explore collection <ArrowRight size={14} /></Link>
        </Reveal>
      </div>
      <div className="absolute bottom-6 right-8 hidden text-[9px] uppercase tracking-[.2em] text-white/80 md:block">Hand-poured slowly in India</div>
    </section>
    <DiwaliCollection />
    <section className="container-page grid grid-cols-1 gap-px border-x border-[#e8e1d8] bg-[#e8e1d8] py-5 sm:grid-cols-3">
      {[["Thoughtfully made", "100% natural soy wax", Leaf], ["A little more mindful", "Clean, considered fragrance", Sparkles], ["Arrives with care", "Gift-ready, always", PackageCheck]].map(([title, caption, Icon]) => {
        const Glyph = Icon as typeof Leaf;
        return <div key={title as string} className="flex items-center justify-center gap-3 bg-[#fbf8f3] py-4"><Glyph size={17} strokeWidth={1.3} className="text-[#a85f45]" /><div><p className="text-[10px] uppercase tracking-widest">{title as string}</p><p className="mt-1 text-[10px] text-[#82776d]">{caption as string}</p></div></div>;
      })}
    </section>
    <section className="section-space container-page">
      <div className="mb-10 flex items-end justify-between"><div><p className="eyebrow">Made to be lived with</p><h2 className="font-display mt-3 text-5xl">Find your feeling</h2></div><Link href="/candles" className="hidden items-center gap-2 text-[10px] uppercase tracking-widest sm:flex">Explore collection <ArrowRight size={14} /></Link></div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[["Everyday rituals", "Quiet little moments, made special.", candleImages[6].src, "/shop?category=Ritual+candles"], ["Signature scents", "The scents you'll come back to.", candleImages[9].src, "/candles"], ["Thoughtful gifting", "A little warmth, beautifully wrapped.", candleImages[5].src, "/shop?category=Gift+sets"]].map(([title, copy, image, href]) => <Link href={href} key={title} className="group relative aspect-[.95] overflow-hidden bg-[#dfd0bf]">
          <Image src={image} alt={title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 text-white"><h3 className="font-display text-3xl">{title}</h3><p className="mt-1 text-xs text-white/80">{copy}</p></div>
        </Link>)}
      </div>
    </section>
    <section className="container-page grid items-center gap-8 py-16 md:grid-cols-2 md:gap-12 md:py-20">
      <EventSlider photos={eventPhotos} />
      <div className="max-w-xl py-4">
        <p className="eyebrow">Out in the world, together</p>
        <h2 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">From our little studio to your favourite events.</h2>
        <p className="mt-5 text-sm leading-7 text-[#71665d]">
          We have been delighted to bring Evana to the Horn OK! Please festival in Delhi, Boho Bazaar, the National Crafts Museum in Delhi, and many lovely society events. Meeting you in person, sharing our candles, and hearing what you love is one of our favourite parts of this journey.
        </p>
      </div>
    </section>
    <section className="bg-[#f1ebe3] py-20">
      <div className="container-page">
        <div className="mb-10 flex items-end justify-between"><div><p className="eyebrow">Loved, lit, relit</p><h2 className="font-display mt-3 text-5xl">The ones you love</h2></div><Link href="/shop" className="text-[10px] uppercase tracking-widest">Shop all</Link></div>
        <ProductShelf />
      </div>
    </section>
    <section className="bg-[#f1ebe3] py-16" id="waxbars">
      <div className="container-page"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Small melts, lovely moments</p><h2 className="font-display mt-3 text-5xl">Wax bars</h2><p className="mt-3 text-sm text-[#82776d]">Fragrant little wax pieces for your favourite warmer. ₹150 each.</p></div><Link href="/waxbars" className="btn-outline">Explore wax bars <ArrowRight size={14} /></Link></div><div className="grid gap-5 sm:grid-cols-2">{waxbarImages.map(image => { const product = products.find(item => item.image === image.src); return <Link href={`/products/${product?.slug ?? "floral-garden-wax-bars"}`} key={image.src} className="group relative aspect-[1.5] overflow-hidden bg-[#e1d5c8]"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" /><span className="absolute bottom-4 left-4 bg-[#fbf8f3]/90 px-4 py-2 font-display text-xl">{image.name} · ₹150</span></Link>; })}</div></div>
    </section>
    <section className="container-page grid items-center gap-10 py-20 md:grid-cols-2 md:gap-20">
      <div className="relative aspect-[.95] overflow-hidden bg-[#ded1c1]"><Image src="/our%20story.png" alt="Evana's handmade floral candle arrangement" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /></div>
      <div className="max-w-lg py-5"><p className="eyebrow">A note from Jaya</p><h2 className="font-display mt-4 text-5xl leading-tight md:text-6xl">A little light,<br /><i>a lot of feeling.</i></h2><p className="mt-6 text-sm leading-7 text-[#71665d]">Evana began with a simple thought: the things we bring into our homes should help us feel more at home. Each candle is poured by hand, in small batches, with ingredients chosen with intention.</p><Link href="/about" className="btn-outline mt-8">Our story <ArrowRight size={13} className="ml-3" /></Link></div>
    </section>
    <section className="bg-[#4a3a31] py-16 text-center text-[#f8f3ed]"><p className="eyebrow !text-[#d3a38a]">Kind words, warm hearts</p><p className="font-display mx-auto mt-5 max-w-3xl text-3xl leading-snug md:text-5xl">“It doesn’t just smell beautiful. It somehow makes the whole room feel like a deep breath.”</p><p className="mt-6 text-[9px] uppercase tracking-[.2em] text-[#c7b9ae]">— Aditi, verified customer</p><Link href="/feedback" className="btn-outline mt-8 border-[#b7a99c] text-white hover:text-white">Share your feedback</Link></section>
    <section className="container-page grid gap-8 py-20 md:grid-cols-[1fr_1.1fr] md:items-center">
      <div><p className="eyebrow">A slower scroll</p><h2 className="font-display mt-3 text-5xl">Little moments,<br /><i>with Evana.</i></h2><p className="mt-5 text-sm text-[#82776d]">Follow along for rituals, real homes, and the occasional behind-the-scenes pour.</p><Link className="btn-outline mt-6" href="/instagram">Instagram <ArrowRight size={13} className="ml-2" /></Link></div>
      <div className="grid grid-cols-3 gap-2">{candleImages.slice(0, 3).map(image => <div key={image.src} className="relative aspect-square overflow-hidden bg-[#e8e1d8]"><Image src={image.src} alt={image.alt} fill sizes="33vw" className="object-cover" /></div>)}</div>
    </section>
    <WhatsAppButton />
  </>;
}
