import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getCouponDiscount } from "@/lib/coupons";
import { rateLimit, requestIp } from "@/lib/rate-limit";
const schema = z.object({ code: z.string().trim().min(3).max(30), subtotal: z.number().int().min(0).max(10000000) });
export async function POST(request: Request) {
  if (!rateLimit(`coupon:${requestIp(request)}`, 8, 60_000).allowed) return NextResponse.json({ error: "Please wait before trying another code." }, { status: 429 });
  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Enter a valid coupon code." }, { status: 400 });
  await connectDB();
  const result = await getCouponDiscount(input.data.code, input.data.subtotal);
  if (!result) return NextResponse.json({ error: "That coupon is invalid, expired, or doesn't apply to this order." }, { status: 400 });
  return NextResponse.json(result);
}
