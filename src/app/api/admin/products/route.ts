import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductModel } from "@/lib/models";
import { requireAdmin, unauthorized } from "@/lib/admin";
import { productSchema } from "@/lib/product-validation";
export async function GET() {
  if (!await requireAdmin()) return unauthorized();
  await connectDB();
  const products = await ProductModel.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ products });
}
export async function POST(request: Request) {
  if (!await requireAdmin()) return unauthorized();
  const input = productSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Please complete all product fields with valid values." }, { status: 400 });
  await connectDB();
  try { const product = await ProductModel.create({ ...input.data, variants: [{ name: "Classic", size: input.data.size, price: input.data.price, stock: input.data.stock }] }); return NextResponse.json({ product }, { status: 201 }); }
  catch (error) {
    if (error instanceof Error && "code" in error && error.code === 11000) return NextResponse.json({ error: "A product with this slug already exists." }, { status: 409 });
    throw error;
  }
}
