import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Review } from "@/lib/models";
import { requireAdmin, unauthorized } from "@/lib/admin";
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return unauthorized();
  const input = z.object({ approved: z.boolean() }).safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Invalid review update." }, { status: 400 });
  await connectDB();
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) return NextResponse.json({ error: "Review not found." }, { status: 404 });
  const review = await Review.findByIdAndUpdate(id, { approved: input.data.approved }, { new: true });
  if (!review) return NextResponse.json({ error: "Review not found." }, { status: 404 });
  return NextResponse.json({ review });
}
