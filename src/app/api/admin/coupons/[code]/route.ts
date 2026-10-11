import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Coupon } from "@/lib/models";
import { requireAdmin, unauthorized } from "@/lib/admin";
export async function PATCH(request: Request, { params }: { params: Promise<{ code: string }> }) {
  if (!await requireAdmin()) return unauthorized();
  const body = z.object({ active: z.boolean() }).safeParse(await request.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Invalid coupon update." }, { status: 400 });
  await connectDB();
  const { code } = await params;
  const coupon = await Coupon.findOneAndUpdate({ code: code.toUpperCase() }, { active: body.data.active }, { new: true });
  if (!coupon) return NextResponse.json({ error: "Coupon not found." }, { status: 404 });
  return NextResponse.json({ coupon });
}
