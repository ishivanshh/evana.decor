import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models";
import { requireAdmin, unauthorized } from "@/lib/admin";
export async function GET() {
  if (!await requireAdmin()) return unauthorized();
  await connectDB();
  const customers = await Order.aggregate([
    { $sort: { createdAt: -1 } },
    { $group: { _id: "$customer.email", name: { $first: "$customer.name" }, email: { $first: "$customer.email" }, phone: { $first: "$customer.phone" }, orders: { $sum: 1 }, spent: { $sum: "$total" }, lastOrder: { $first: "$createdAt" } } },
    { $sort: { lastOrder: -1 } }, { $limit: 500 },
  ]);
  return NextResponse.json({ customers });
}
