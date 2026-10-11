import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductModel } from "@/lib/models";
import { rateLimit, requestIp } from "@/lib/rate-limit";
export const dynamic = "force-dynamic";
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!rateLimit(`product:${requestIp(_request)}`, 60, 60_000).allowed) return NextResponse.json({ error: "Please slow down and try again." }, { status: 429 });
  await connectDB();
  const { slug } = await params;
  const product = await ProductModel.findOne({ slug, published: true }).lean();
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json({ product });
}
