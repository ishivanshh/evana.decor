import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { StoreSettings } from "@/lib/models";
import { requireAdmin, unauthorized } from "@/lib/admin";
const schema = z.object({ storeName: z.string().trim().min(2).max(100), shippingCharge: z.coerce.number().min(0), freeShippingThreshold: z.coerce.number().min(0), codCharge: z.coerce.number().min(0), whatsappNumber: z.string().trim().max(30) });
export async function GET() {
  if (!await requireAdmin()) return unauthorized();
  await connectDB();
  const settings = await StoreSettings.findOne({ key: "default" }).lean();
  return NextResponse.json({ settings: settings ?? { storeName: "Evana", shippingCharge: 99, freeShippingThreshold: 1999, codCharge: 0, whatsappNumber: "" } });
}
export async function PUT(request: Request) {
  if (!await requireAdmin()) return unauthorized();
  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Please enter valid store settings." }, { status: 400 });
  await connectDB();
  const settings = await StoreSettings.findOneAndUpdate({ key: "default" }, { ...input.data, key: "default" }, { new: true, upsert: true, runValidators: true });
  return NextResponse.json({ settings });
}
