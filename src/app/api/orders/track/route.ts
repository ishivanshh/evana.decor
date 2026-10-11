import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models";
import { rateLimit, requestIp } from "@/lib/rate-limit";

const schema = z.object({ orderNumber: z.string().trim().min(5).max(32), contact: z.string().trim().min(5).max(254) });
export async function POST(request: Request) {
  if (!rateLimit(`track:${requestIp(request)}`, 10, 60_000).allowed) return NextResponse.json({ error: "Too many lookup attempts. Try again shortly." }, { status: 429 });
  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Enter a valid order number and phone or email." }, { status: 400 });
  await connectDB();
  const order = await Order.findOne({
    orderNumber: input.data.orderNumber.toUpperCase(),
    $or: [{ "customer.phone": input.data.contact }, { "customer.email": input.data.contact.toLowerCase() }],
  }).select("orderNumber status statusHistory items total createdAt rejectionReason").lean();
  if (!order) return NextResponse.json({ error: "We couldn't find an order with those details." }, { status: 404 });
  return NextResponse.json({ order });
}
