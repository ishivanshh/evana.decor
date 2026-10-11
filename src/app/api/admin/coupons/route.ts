import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Coupon } from "@/lib/models";
import { requireAdmin, unauthorized } from "@/lib/admin";
const schema = z.object({ code: z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/), type: z.enum(["PERCENT", "FLAT"]), value: z.coerce.number().positive(), minimum: z.coerce.number().min(0).default(0), expiresAt: z.string().optional() }).refine(data => data.type !== "PERCENT" || data.value <= 100);
export async function GET() {
  if (!await requireAdmin()) return unauthorized();
  await connectDB();
  return NextResponse.json({ coupons: await Coupon.find().sort({ createdAt: -1 }).lean() });
}
export async function POST(request: Request) {
  if (!await requireAdmin()) return unauthorized();
  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Enter a valid coupon. Percentage discounts cannot exceed 100%." }, { status: 400 });
  await connectDB();
  try { const coupon = await Coupon.create({ ...input.data, code: input.data.code.toUpperCase(), expiresAt: input.data.expiresAt ? new Date(input.data.expiresAt) : undefined }); return NextResponse.json({ coupon }, { status: 201 }); }
  catch (error) {
    if (error instanceof Error && "code" in error && error.code === 11000) return NextResponse.json({ error: "This coupon code already exists." }, { status: 409 });
    throw error;
  }
}
