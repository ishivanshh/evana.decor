"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";

const candleCollections = [
  ["Jute", "/candle/jute"],
  ["Gulban", "/candle/gulban"],
  ["Diwali", "/candle/diwali"],
  ["Valentine's", "/candle/valentines"],
  ["Christmas", "/candle/christmas"],
  ["Ocean", "/candle/ocean"],
];

const links = [
  ["Wax bars", "/waxbars"],
  ["Bulk orders", "/bulk-orders"],
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count, freeShippingThreshold } = useCart();
  const [open, setOpen] = useState(false);
  const [candlesOpen, setCandlesOpen] = useState(false);
  if (pathname.startsWith("/admin")) return null;
  return (
    <>
      <div className="bg-[#4a3a31] py-2 text-center text-[9px] tracking-[.19em] text-[#f9f3ec]">
        COMPLIMENTARY SHIPPING ON ORDERS ABOVE ₹
        {freeShippingThreshold.toLocaleString("en-IN")}
      </div>
      <header className="relative z-20 border-b border-[#e8e1d8] bg-[#fbf8f3]">
        <div className="container-page flex h-[76px] items-center justify-between">
          <button
            aria-label="Open menu"
            className="lg:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
          <nav className="hidden items-center gap-8 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setCandlesOpen(true)}
              onMouseLeave={() => setCandlesOpen(false)}
              onFocus={() => setCandlesOpen(true)}
              onBlur={event => {
                if (!event.currentTarget.contains(event.relatedTarget)) setCandlesOpen(false);
              }}
            >
              <Link
                href="/candles"
                aria-haspopup="true"
                aria-expanded={candlesOpen}
                className="flex items-center gap-1 text-[10px] uppercase tracking-[.16em] text-[#62564d] transition hover:text-[#a85f45]"
              >
                Candles <ChevronDown size={12} />
              </Link>
              <div className={`absolute left-0 top-full min-w-44 pt-3 transition ${candlesOpen ? "visible opacity-100" : "invisible opacity-0"}`}>
                <div className="border border-[#e8e1d8] bg-[#fbf8f3] py-2 shadow-lg">
                  <Link
                    href="/candles"
                    className="block px-4 py-2.5 text-[10px] uppercase tracking-[.14em] text-[#62564d] hover:bg-[#f1ebe3] hover:text-[#a85f45]"
                  >
                    Explore all candles
                  </Link>
                  {candleCollections.map(([label, href]) => (
                    <Link
                      key={label}
                      href={href}
                      className="block px-4 py-2.5 text-[10px] uppercase tracking-[.14em] text-[#62564d] hover:bg-[#f1ebe3] hover:text-[#a85f45]"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {links.map(([label, href]) => (
              <Link
                key={label}
                className="text-[10px] uppercase tracking-[.16em] text-[#62564d] transition hover:text-[#a85f45]"
                href={href}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-center"
          >
            <span className="font-display text-[36px] leading-none tracking-[.15em]">
              Evana
            </span>
            <span className="mt-1 block text-[8px] uppercase tracking-[.31em] text-[#897c70]">
              slow living, by design
            </span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-5">
            <Link href="/shop" aria-label="Search">
              <Search size={18} strokeWidth={1.4} />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist">
              <Heart size={18} strokeWidth={1.4} />
            </Link>
            <Link href="/account" aria-label="Account">
              <UserRound size={18} strokeWidth={1.4} />
            </Link>
            <Link
              href="/cart"
              className="relative"
              aria-label={`Shopping bag, ${count} items`}
            >
              <ShoppingBag size={19} strokeWidth={1.4} />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#a85f45] text-[9px] text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
        {open && (
          <nav className="absolute inset-x-0 top-full border-b border-[#e8e1d8] bg-[#fbf8f3] px-6 py-5 shadow-sm lg:hidden">
            <Link
              onClick={() => setOpen(false)}
              className="block border-b border-[#e8e1d8] py-4 text-xs uppercase tracking-widest"
              href="/candles"
            >
              All candles
            </Link>
            {candleCollections.map(([label, href]) => (
              <Link
                onClick={() => setOpen(false)}
                key={label}
                className="block border-b border-[#e8e1d8] py-4 pl-4 text-xs uppercase tracking-widest"
                href={href}
              >
                {label}
              </Link>
            ))}
            {links.map(([label, href]) => (
              <Link
                onClick={() => setOpen(false)}
                key={label}
                className="block border-b border-[#e8e1d8] py-4 text-xs uppercase tracking-widest"
                href={href}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
