import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models";
import { requireAdmin, unauthorized } from "@/lib/admin";
const schema = z.object({ name: z.string().trim().min(2).max(80), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: z.string().trim().max(500).optional() });
export async function GET() {
  if (!await requireAdmin()) return unauthorized();
  await connectDB();
  return NextResponse.json({ categories: await Category.find().sort({ name: 1 }).lean() });
}
export async function POST(request: Request) {
  if (!await requireAdmin()) return unauthorized();
  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Enter a valid collection name and slug." }, { status: 400 });
  await connectDB();
  try { return NextResponse.json({ category: await Category.create(input.data) }, { status: 201 }); }
  catch (error) {
    if (error instanceof Error && "code" in error && error.code === 11000) return NextResponse.json({ error: "That collection name or slug already exists." }, { status: 409 });
    throw error;
  }
}
