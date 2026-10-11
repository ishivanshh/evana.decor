"use client";
import { useCart } from "@/components/cart-provider";
export function WhatsAppButton() {
  const { whatsappNumber } = useCart();
  if (!whatsappNumber) return null;
  return <a href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="fixed bottom-5 right-5 z-30 rounded-full bg-[#4e7255] px-5 py-3 text-[10px] uppercase tracking-widest text-white shadow-lg">Order on WhatsApp</a>;
}
