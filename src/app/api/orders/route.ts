import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Order, ProductModel, StoreSettings } from "@/lib/models";
import { getCouponDiscount } from "@/lib/coupons";
import { rateLimit, requestIp } from "@/lib/rate-limit";
import { sendOrderEmail } from "@/lib/email";
import { getPaymentProvider } from "@/lib/payments/provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const inputSchema = z.object({
  customer: z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254), phone: z.string().trim().regex(/^[6-9]\d{9}$/) }),
  address: z.object({ line1: z.string().trim().min(5).max(180), line2: z.string().trim().max(120).optional(), city: z.string().trim().min(2).max(80), state: z.string().trim().min(2).max(80), pincode: z.string().trim().regex(/^\d{6}$/) }),
  items: z.array(z.object({ slug: z.string().regex(/^[a-z0-9-]{1,80}$/), quantity: z.number().int().min(1).max(10) })).min(1).max(20),
  couponCode: z.string().trim().max(40).optional(),
  paymentMethod: z.literal("COD"),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "customer") return NextResponse.json({ error: "Please sign in to place an order." }, { status: 401 });
  const limit = rateLimit(`orders:${requestIp(request)}`, 5, 60_000);
  if (!limit.allowed) return NextResponse.json({ error: "Too many checkout attempts. Please try again in a minute." }, { status: 429 });
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check your details and try again.", details: parsed.error.flatten() }, { status: 400 });
  try {
    await connectDB();
    const uniqueSlugs = [...new Set(parsed.data.items.map(item => item.slug))];
    const found = await ProductModel.find({ slug: { $in: uniqueSlugs }, published: true }).lean();
    if (found.length !== uniqueSlugs.length) return NextResponse.json({ error: "One or more products are no longer available." }, { status: 409 });
    const products = new Map(found.map(product => [product.slug, product]));
    const items = parsed.data.items.map(item => {
      const product = products.get(item.slug)!;
      if (product.stock < item.quantity) throw new Error(`Only ${product.stock} left for ${product.name}.`);
      return { productId: product._id, name: product.name, slug: product.slug, image: product.image, price: product.price, quantity: item.quantity };
    });
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const settings = await StoreSettings.findOne({ key: "default" }).lean();
    let discount = 0;
    let couponCode: string | undefined;
    if (parsed.data.couponCode) {
      const coupon = await getCouponDiscount(parsed.data.couponCode, subtotal);
      if (!coupon) return NextResponse.json({ error: "That coupon is invalid or does not apply to this order." }, { status: 400 });
      discount = coupon.discount;
      couponCode = coupon.code;
    }
    const threshold = settings?.freeShippingThreshold ?? 1999;
    const shipping = subtotal >= threshold ? 0 : (settings?.shippingCharge ?? 99);
    const total = subtotal - discount + shipping + (settings?.codCharge ?? 0);
    const orderNumber = `EV${Date.now().toString().slice(-8)}${randomUUID().slice(0, 4).toUpperCase()}`;
    await Order.create({
      orderNumber, customer: parsed.data.customer, address: parsed.data.address, items, subtotal, shipping, discount, couponCode, total,
      paymentMethod: "COD", status: "PENDING", statusHistory: [{ status: "PENDING", note: "Order placed", at: new Date() }],
    });
    await getPaymentProvider("COD").createPayment({ orderId: orderNumber, amount: total, currency: "INR" });
    const ownerEmail = process.env.OWNER_EMAIL;
    const emailJobs = [
      sendOrderEmail({ to: parsed.data.customer.email, subject: `Your Evana order ${orderNumber} is confirmed`, text: `Thank you, ${parsed.data.customer.name}. Your order ${orderNumber} has been received and is pending confirmation. Total due on delivery: ₹${total}.` }),
      ownerEmail ? sendOrderEmail({ to: ownerEmail, subject: `New Evana order ${orderNumber}`, text: `${parsed.data.customer.name} placed a COD order for ₹${total}. Review it in the owner dashboard.` }) : Promise.resolve(),
    ];
    const emailResults = await Promise.allSettled(emailJobs);
    for (const result of emailResults) if (result.status === "rejected") console.error("Order email error:", result.reason);
    return NextResponse.json({ orderNumber, total, status: "PENDING" }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create your order.";
    const status = message.startsWith("Only ") ? 409 : 500;
    if (status === 500) console.error("Create order error:", error);
    return NextResponse.json({ error: message }, { status });
  }
}
