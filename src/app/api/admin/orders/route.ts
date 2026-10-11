import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models";
import { requireAdmin, unauthorized } from "@/lib/admin";

export async function GET(request: Request) {
  if (!await requireAdmin()) return unauthorized();
  await connectDB();
  const params = new URL(request.url).searchParams;
  const status = params.get("status");
  const q = params.get("q")?.trim();
  const query: Record<string, unknown> = {};
  if (status && status !== "ALL") query.status = status;
  const from = params.get("from");
  const to = params.get("to");
  if (from || to) {
    const range: { $gte?: Date; $lte?: Date } = {};
    if (from) { const date = new Date(`${from}T00:00:00.000Z`); if (Number.isNaN(date.getTime())) return NextResponse.json({ error: "Invalid start date." }, { status: 400 }); range.$gte = date; }
    if (to) { const date = new Date(`${to}T23:59:59.999Z`); if (Number.isNaN(date.getTime())) return NextResponse.json({ error: "Invalid end date." }, { status: 400 }); range.$lte = date; }
    query.createdAt = range;
  }
  if (q) {
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.$or = [{ orderNumber: { $regex: escaped, $options: "i" } }, { "customer.name": { $regex: escaped, $options: "i" } }, { "customer.phone": { $regex: escaped, $options: "i" } }];
  }
  const orders = await Order.find(query).sort({ createdAt: -1 }).limit(200).lean();
  return NextResponse.json({ orders });
}
