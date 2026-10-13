"use client";

import { Camera, MessageCircle } from "lucide-react";
import { useCart } from "@/components/cart-provider";

const instagramUrl = "https://www.instagram.com/evana_candles/";
const fallbackWhatsAppNumber = "919999999999";

export function BulkOrderContact() {
  const { whatsappNumber } = useCart();
  const phone = whatsappNumber.replace(/\D/g, "");
  const hasRealWhatsAppNumber = phone.length >= 10 && phone !== fallbackWhatsAppNumber;
  const message = encodeURIComponent("Hi Evana, I'd love to discuss a bulk order and customisation.");

  return (
    <div className="mt-7 flex flex-wrap justify-center gap-3">
      {hasRealWhatsAppNumber ? (
        <a
          className="btn-primary"
          href={`https://wa.me/${phone}?text=${message}`}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={16} /> Message us on WhatsApp
        </a>
      ) : (
        <p className="basis-full text-center text-xs text-[#82776d]">
          Add your WhatsApp number in Admin → Settings to enable WhatsApp enquiries.
        </p>
      )}
      <a
        className="btn-outline"
        href={instagramUrl}
        target="_blank"
        rel="noreferrer"
      >
        <Camera size={16} /> Message us on Instagram
      </a>
    </div>
  );
}
