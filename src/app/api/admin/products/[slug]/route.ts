import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductModel } from "@/lib/models";
import { requireAdmin, unauthorized } from "@/lib/admin";
import { productUpdateSchema } from "@/lib/product-validation";
export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!await requireAdmin()) return unauthorized();
  const input = productUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Invalid product update." }, { status: 400 });
  await connectDB();
  const { slug } = await params;
  const existing = await ProductModel.findOne({ slug });
  if (!existing) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  const update: Record<string, unknown> = { ...input.data };
  if (input.data.price !== undefined || input.data.stock !== undefined || input.data.size !== undefined) {
    update.variants = [{ name: "Classic", size: input.data.size ?? existing.size, price: input.data.price ?? existing.price, stock: input.data.stock ?? existing.stock }];
  }
  const product = await ProductModel.findOneAndUpdate({ slug }, { $set: update }, { new: true, runValidators: true });
  return NextResponse.json({ product });
}
export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!await requireAdmin()) return unauthorized();
  await connectDB();
  const { slug } = await params;
  const product = await ProductModel.findOneAndUpdate({ slug }, { published: false }, { new: true });
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json({ product });
}
