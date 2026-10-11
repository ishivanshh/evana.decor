import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models";
import { requireAdmin, unauthorized } from "@/lib/admin";

function csv(value: unknown) {
  let text = String(value ?? "");
  if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}
export async function GET() {
  if (!await requireAdmin()) return unauthorized();
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 }).limit(10000).lean() as {
    orderNumber: string; customer: { name: string; email: string; phone: string }; items: { name: string; quantity: number }[];
    subtotal: number; shipping: number; total: number; paymentMethod: string; status: string; createdAt: Date;
  }[];
  const rows = [["Order", "Name", "Email", "Phone", "Items", "Subtotal", "Shipping", "Total", "Payment", "Status", "Date"], ...orders.map(order => [
    order.orderNumber, order.customer.name, order.customer.email, order.customer.phone,
    order.items.map(item => `${item.name} x${item.quantity}`).join("; "), order.subtotal, order.shipping, order.total, order.paymentMethod, order.status, order.createdAt.toISOString(),
  ])];
  return new NextResponse(rows.map(row => row.map(csv).join(",")).join("\r\n"), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="evana-orders.csv"' } });
}
