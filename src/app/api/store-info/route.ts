import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { StoreSettings } from "@/lib/models";
import { rateLimit, requestIp } from "@/lib/rate-limit";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  if (!rateLimit(`store-info:${requestIp(request)}`, 60, 60_000).allowed) return NextResponse.json({ error: "Please slow down and try again." }, { status: 429 });
  await connectDB();
  const settings = await StoreSettings.findOne({ key: "default" }).select("storeName shippingCharge freeShippingThreshold codCharge whatsappNumber").lean();
  return NextResponse.json({ settings: settings ?? { storeName: "Evana", shippingCharge: 99, freeShippingThreshold: 1999, codCharge: 0, whatsappNumber: "" } });
}
