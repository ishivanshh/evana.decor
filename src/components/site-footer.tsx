import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
export function SiteFooter() {
  return <footer className="bg-[#3c3029] text-[#f8f3ed]">
    <div className="container-page grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
      <div><Link href="/" className="font-display text-4xl tracking-[.16em]">evana</Link><p className="mt-4 max-w-xs text-sm leading-7 text-[#c9bdb2]">Small-batch candles for softer evenings, slower mornings, and all the little rituals in between.</p><Link href="https://instagram.com" aria-label="Instagram" className="mt-5 inline-block text-xs uppercase tracking-widest">Instagram ↗</Link></div>
      <div><h3 className="eyebrow !text-[#c58a70]">Explore</h3><div className="mt-5 grid gap-3 text-sm text-[#d6ccc3]"><Link href="/shop">Shop all</Link><Link href="/candles">Candles</Link><Link href="/waxbars">Wax bars</Link><Link href="/feedback">Share feedback</Link><Link href="/about">Our story</Link><Link href="/track-order">Track your order</Link><Link href="/contact">Contact</Link></div></div>
      <div><h3 className="eyebrow !text-[#c58a70]">The details</h3><div className="mt-5 grid gap-3 text-sm text-[#d6ccc3]"><Link href="/shipping">Shipping & returns</Link><Link href="/faq">FAQs</Link><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms of service</Link></div></div>
      <div><h3 className="eyebrow !text-[#c58a70]">A little note from us</h3><p className="mt-4 text-sm leading-6 text-[#d6ccc3]">Occasional rituals, new scents, and the good things in between.</p><NewsletterForm /></div>
    </div>
    <div className="border-t border-[#57483f] py-5 text-center text-[9px] uppercase tracking-[.18em] text-[#aa9a8e]">© {new Date().getFullYear()} Evana by Jaya Saxena · Made with care in India</div>
  </footer>;
}
