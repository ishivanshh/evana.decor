import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Review } from "@/lib/models";
import { requireAdmin, unauthorized } from "@/lib/admin";
export async function GET() {
  if (!await requireAdmin()) return unauthorized();
  await connectDB();
  const reviews = await Review.find().populate("productId", "name slug").sort({ createdAt: -1 }).limit(300).lean();
  return NextResponse.json({ reviews });
}
