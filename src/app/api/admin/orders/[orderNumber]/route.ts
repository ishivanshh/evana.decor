import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Order, ProductModel } from "@/lib/models";
import { requireAdmin, unauthorized } from "@/lib/admin";
import { sendOrderEmail } from "@/lib/email";

const schema = z.object({ status: z.enum(["ACCEPTED", "REJECTED", "SHIPPED", "DELIVERED", "CANCELLED"]), reason: z.string().trim().min(5).max(500).optional() });
const transitions: Record<string, string[]> = { PENDING: ["ACCEPTED", "REJECTED", "CANCELLED"], ACCEPTED: ["SHIPPED", "CANCELLED"], SHIPPED: ["DELIVERED"], DELIVERED: [], REJECTED: [], CANCELLED: [] };

export async function PATCH(request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  if (!await requireAdmin()) return unauthorized();
  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Invalid status update." }, { status: 400 });
  if (input.data.status === "REJECTED" && !input.data.reason) return NextResponse.json({ error: "A reason is required to reject an order." }, { status: 400 });
  await connectDB();
  const { orderNumber } = await params;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const order = await Order.findOne({ orderNumber }).session(session);
      if (!order) throw new Error("ORDER_NOT_FOUND");
      if (!transitions[order.status]?.includes(input.data.status)) throw new Error(`Cannot move an order from ${order.status} to ${input.data.status}.`);
      if (input.data.status === "ACCEPTED") {
        for (const item of order.items) {
          const result = await ProductModel.updateOne({ _id: item.productId, stock: { $gte: item.quantity } }, { $inc: { stock: -item.quantity } }, { session });
          if (result.modifiedCount !== 1) throw new Error(`Not enough stock for ${item.name}.`);
        }
        order.stockAdjusted = true;
      }
      if (["REJECTED", "CANCELLED"].includes(input.data.status) && order.stockAdjusted) {
        for (const item of order.items) await ProductModel.updateOne({ _id: item.productId }, { $inc: { stock: item.quantity } }, { session });
        order.stockAdjusted = false;
      }
      order.status = input.data.status;
      if (input.data.status === "REJECTED") order.rejectionReason = input.data.reason;
      order.statusHistory.push({ status: input.data.status, note: input.data.status === "REJECTED" ? input.data.reason! : `Order ${input.data.status.toLowerCase()}`, at: new Date() });
      await order.save({ session });
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update this order.";
    if (message === "ORDER_NOT_FOUND") return NextResponse.json({ error: "Order not found." }, { status: 404 });
    return NextResponse.json({ error: message }, { status: 409 });
  } finally { await session.endSession(); }
  const updatedOrder = await Order.findOne({ orderNumber }).select("customer orderNumber status rejectionReason").lean();
  if (updatedOrder) {
    try {
      const note = updatedOrder.status === "REJECTED" ? ` The reason: ${updatedOrder.rejectionReason}` : "";
      await sendOrderEmail({ to: updatedOrder.customer.email, subject: `An update on your Evana order ${updatedOrder.orderNumber}`, text: `Your order is now ${updatedOrder.status}.${note}` });
    } catch (error) { console.error("Status notification email error:", error); }
  }
  return NextResponse.json({ order: updatedOrder });
}
