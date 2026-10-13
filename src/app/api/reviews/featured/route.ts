import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductModel, Review } from "@/lib/models";
import { rateLimit, requestIp } from "@/lib/rate-limit";

export async function GET(request: Request) {
  if (!rateLimit(`featured-reviews:${requestIp(request)}`, 30, 60_000).allowed) {
    return NextResponse.json({ error: "Please slow down and try again shortly." }, { status: 429 });
  }

  await connectDB();
  const reviews = await Review.find({ approved: true, rating: { $gte: 4 } })
    .populate({ path: "productId", model: ProductModel, select: "name image" })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  return NextResponse.json({ reviews });
}
