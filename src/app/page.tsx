import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, PackageCheck, Sparkles } from "lucide-react";
import { ProductShelf } from "@/components/product-shelf";
import { Reveal } from "@/components/reveal";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { productImage } from "@/lib/catalog";

export default function Home() {
  return <>
    <section className="relative min-h-[620px] overflow-hidden bg-[#d9c8b4] md:min-h-[720px]">
      <Image src={productImage("photo-1603006905003-be475563bc59", 2000)} alt="A candle glowing in a softly lit home" fill priority sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#30241c]/65 via-[#30241c]/25 to-transparent" />
      <div className="container-page relative flex min-h-[620px] items-center md:min-h-[720px]">
        <Reveal className="max-w-xl py-20 text-[#fffaf5]">
          <p className="eyebrow !text-[#ead0b8]">A softer kind of everyday</p>
          <h1 className="font-display mt-6 text-6xl leading-[.98] md:text-8xl">Come home<br />to a slower<br /><i>glow.</i></h1>
          <p className="mt-7 max-w-sm text-sm leading-7 text-white/85">Hand-poured soy candles, made in small batches for the moments that make a house feel like yours.</p>
          <Link href="/shop" className="mt-9 inline-flex items-center gap-3 border border-white/75 px-6 py-4 text-[10px] uppercase tracking-[.18em] transition hover:bg-white hover:text-[#382b23]">Find your ritual <ArrowRight size={14} /></Link>
        </Reveal>
      </div>
      <div className="absolute bottom-6 right-8 hidden text-[9px] uppercase tracking-[.2em] text-white/80 md:block">Hand-poured slowly in India</div>
    </section>
    <section className="container-page grid grid-cols-1 gap-px border-x border-[#e8e1d8] bg-[#e8e1d8] py-5 sm:grid-cols-3">
      {[["Thoughtfully made", "100% natural soy wax", Leaf], ["A little more mindful", "Clean, considered fragrance", Sparkles], ["Arrives with care", "Gift-ready, always", PackageCheck]].map(([title, caption, Icon]) => {
        const Glyph = Icon as typeof Leaf;
        return <div key={title as string} className="flex items-center justify-center gap-3 bg-[#fbf8f3] py-4"><Glyph size={17} strokeWidth={1.3} className="text-[#a85f45]" /><div><p className="text-[10px] uppercase tracking-widest">{title as string}</p><p className="mt-1 text-[10px] text-[#82776d]">{caption as string}</p></div></div>;
      })}
    </section>
    <section className="section-space container-page">
      <div className="mb-10 flex items-end justify-between"><div><p className="eyebrow">Made to be lived with</p><h2 className="font-display mt-3 text-5xl">Find your feeling</h2></div><Link href="/shop" className="hidden items-center gap-2 text-[10px] uppercase tracking-widest sm:flex">Explore all <ArrowRight size={14} /></Link></div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[["Everyday rituals", "Quiet little moments, made special.", "photo-1602874801007-bd458bb1b8b6", "/shop?category=Ritual+candles"], ["Signature scents", "The scents you'll come back to.", "photo-1603006905003-be475563bc59", "/shop?category=Signature+candles"], ["Thoughtful gifting", "A little warmth, beautifully wrapped.", "photo-1602523961358-f9f03dd557db", "/shop?category=Gift+sets"]].map(([title, copy, image, href]) => <Link href={href} key={title} className="group relative aspect-[.95] overflow-hidden bg-[#dfd0bf]">
          <Image src={productImage(image, 900)} alt={title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 text-white"><h3 className="font-display text-3xl">{title}</h3><p className="mt-1 text-xs text-white/80">{copy}</p></div>
        </Link>)}
      </div>
    </section>
    <section className="bg-[#f1ebe3] py-20">
      <div className="container-page">
        <div className="mb-10 flex items-end justify-between"><div><p className="eyebrow">Loved, lit, relit</p><h2 className="font-display mt-3 text-5xl">The ones you love</h2></div><Link href="/shop" className="text-[10px] uppercase tracking-widest">Shop all</Link></div>
        <ProductShelf />
      </div>
    </section>
    <section className="container-page grid items-center gap-10 py-20 md:grid-cols-2 md:gap-20">
      <div className="relative aspect-[.95] overflow-hidden bg-[#ded1c1]"><Image src={productImage("photo-1602523961358-f9f03dd557db", 1100)} alt="Quiet candlelit corner of a home" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /></div>
      <div className="max-w-lg py-5"><p className="eyebrow">A note from Jaya</p><h2 className="font-display mt-4 text-5xl leading-tight md:text-6xl">A little light,<br /><i>a lot of feeling.</i></h2><p className="mt-6 text-sm leading-7 text-[#71665d]">Evana began with a simple thought: the things we bring into our homes should help us feel more at home. Each candle is poured by hand, in small batches, with ingredients chosen with intention.</p><Link href="/about" className="btn-outline mt-8">Our story <ArrowRight size={13} className="ml-3" /></Link></div>
    </section>
    <section className="bg-[#4a3a31] py-16 text-center text-[#f8f3ed]"><p className="eyebrow !text-[#d3a38a]">Kind words, warm hearts</p><p className="font-display mx-auto mt-5 max-w-3xl text-3xl leading-snug md:text-5xl">“It doesn’t just smell beautiful. It somehow makes the whole room feel like a deep breath.”</p><p className="mt-6 text-[9px] uppercase tracking-[.2em] text-[#c7b9ae]">— Aditi, verified customer</p></section>
    <section className="container-page grid gap-8 py-20 md:grid-cols-[1fr_1.1fr] md:items-center">
      <div><p className="eyebrow">A slower scroll</p><h2 className="font-display mt-3 text-5xl">Little moments,<br /><i>with Evana.</i></h2><p className="mt-5 text-sm text-[#82776d]">Follow along for rituals, real homes, and the occasional behind-the-scenes pour.</p><Link className="mt-6 inline-flex text-[10px] uppercase tracking-widest" href="https://instagram.com">@evanadecor <ArrowRight size={13} className="ml-2" /></Link></div>
      <div className="grid grid-cols-3 gap-2">{["photo-1603006905003-be475563bc59", "photo-1602874801007-bd458bb1b8b6", "photo-1602523961358-f9f03dd557db"].map((image, index) => <div key={image} className="relative aspect-square overflow-hidden bg-[#e8e1d8]"><Image src={productImage(image, 400)} alt={`Evana candle moment ${index + 1}`} fill sizes="33vw" className="object-cover" /></div>)}</div>
    </section>
    <WhatsAppButton />
  </>;
}
