import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models";
import { PrintButton } from "@/components/print-button";

export const dynamic = "force-dynamic";
export default async function OrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  await connectDB();
  const { orderNumber } = await params;
  const order = await Order.findOne({ orderNumber }).lean();
  if (!order) notFound();
  return <article className="mx-auto max-w-4xl bg-[#fbf8f3] p-6 md:p-10 print:max-w-none print:p-0">
    <div className="flex flex-wrap justify-between gap-4"><div><Link href="/admin/orders" className="text-xs underline print:hidden">← All orders</Link><p className="eyebrow mt-5">Order details</p><h1 className="font-display mt-2 text-5xl">{order.orderNumber}</h1></div><PrintButton /></div>
    <div className="mt-8 grid gap-8 border-y border-[#e8e1d8] py-7 md:grid-cols-2"><section><h2 className="font-display text-2xl">Customer</h2><p className="mt-3 text-sm">{order.customer.name}</p><p className="mt-1 text-sm">{order.customer.email}</p><p className="mt-1 text-sm">{order.customer.phone}</p><h3 className="mt-6 text-[10px] uppercase tracking-widest text-[#82776d]">Shipping address</h3><p className="mt-2 text-sm leading-6">{order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}<br />{order.address.city}, {order.address.state} {order.address.pincode}<br />{order.address.country}</p></section><section><h2 className="font-display text-2xl">Order summary</h2><p className="mt-3 text-sm">Status: {order.status}</p><p className="mt-1 text-sm">Payment: Cash on delivery</p><p className="mt-1 text-sm">Placed: {new Date(order.createdAt).toLocaleString("en-IN")}</p>{order.rejectionReason && <p className="mt-3 text-sm text-red-800">Rejection reason: {order.rejectionReason}</p>}</section></div>
    <section className="mt-7"><h2 className="font-display text-2xl">Items</h2>{order.items.map((item: { slug: string; name: string; quantity: number; price: number }, index: number) => <div key={`${item.slug}-${index}`} className="flex justify-between border-b border-[#e8e1d8] py-4 text-sm"><span>{item.name} × {item.quantity}</span><span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span></div>)}
      <div className="ml-auto mt-5 max-w-xs space-y-2 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal.toLocaleString("en-IN")}</span></div><div className="flex justify-between"><span>Shipping</span><span>₹{order.shipping.toLocaleString("en-IN")}</span></div>{order.discount > 0 && <div className="flex justify-between"><span>Discount</span><span>−₹{order.discount.toLocaleString("en-IN")}</span></div>}<div className="flex justify-between border-t border-[#d8cec3] pt-3 font-medium"><span>Total due on delivery</span><span>₹{order.total.toLocaleString("en-IN")}</span></div></div>
    </section>
  </article>;
}
