import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartProvider } from "@/components/cart-provider";
import { CartDrawer } from "@/components/cart-drawer";
import { GoogleAnalytics } from "@/components/google-analytics";

const display = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500", "600"] });
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Evana — Candles for slower living", template: "%s | Evana" },
  description: "Hand-poured soy candles and thoughtful home rituals, made in India.",
  openGraph: { title: "Evana — Candles for slower living", description: "Hand-poured soy candles and thoughtful home rituals, made in India.", type: "website", images: [{ url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85", width: 1200, height: 630, alt: "Evana hand-poured candles" }] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} antialiased`}>
        <CartProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <CartDrawer />
          <GoogleAnalytics />
        </CartProvider>
      </body>
    </html>
  );
}
