import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductModel } from "@/lib/models";
import { rateLimit, requestIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  if (!rateLimit(`products:${requestIp(request)}`, 60, 60_000).allowed) return NextResponse.json({ error: "Please slow down and try again." }, { status: 429 });
  await connectDB();
  const products = await ProductModel.find({ published: true }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ products });
}
