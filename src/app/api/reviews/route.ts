import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { ProductModel, Review } from "@/lib/models";
import { rateLimit, requestIp } from "@/lib/rate-limit";
const schema = z.object({ slug: z.string().trim().regex(/^[a-z0-9-]{1,80}$/), name: z.string().trim().min(2).max(80), rating: z.number().int().min(1).max(5), body: z.string().trim().min(15).max(1000) });
export async function GET(request: Request) {
  if (!rateLimit(`reviews-read:${requestIp(request)}`, 60, 60_000).allowed) return NextResponse.json({ error: "Please slow down and try again shortly." }, { status: 429 });
  await connectDB();
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug || !/^[a-z0-9-]{1,80}$/.test(slug)) return NextResponse.json({ error: "A valid product slug is required." }, { status: 400 });
  const product = await ProductModel.findOne({ slug }).select("_id").lean();
  if (!product) return NextResponse.json({ reviews: [] });
  const reviews = await Review.find({ productId: product._id, approved: true }).select("name rating body createdAt").sort({ createdAt: -1 }).limit(50).lean();
  return NextResponse.json({ reviews });
}
export async function POST(request: Request) {
  if (!rateLimit(`reviews:${requestIp(request)}`, 4, 60_000).allowed) return NextResponse.json({ error: "Please wait before sending another review." }, { status: 429 });
  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Please enter a name, rating, and review of at least 15 characters." }, { status: 400 });
  await connectDB();
  const product = await ProductModel.findOne({ slug: input.data.slug, published: true }).select("_id").lean();
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  await Review.create({ productId: product._id, name: input.data.name, rating: input.data.rating, body: input.data.body, approved: false });
  return NextResponse.json({ message: "Thank you. Your review will appear after a quick check." }, { status: 201 });
}
