import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Order, ProductModel } from "@/lib/models";
import { SalesChart } from "@/components/sales-chart";

export const dynamic = "force-dynamic";
export default async function AdminOverview() {
  await connectDB();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(today); sevenDaysAgo.setDate(today.getDate() - 6);
  const [total, pending, todayCount, revenue, recent, lowStock, sales] = await Promise.all([
    Order.countDocuments(), Order.countDocuments({ status: "PENDING" }), Order.countDocuments({ createdAt: { $gte: today } }),
    Order.aggregate([{ $match: { status: { $in: ["ACCEPTED", "SHIPPED", "DELIVERED"] } } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(), ProductModel.find({ published: true, stock: { $lte: 5 } }).select("name stock").limit(5).lean(),
    Order.aggregate([{ $match: { createdAt: { $gte: sevenDaysAgo }, status: { $in: ["ACCEPTED", "SHIPPED", "DELIVERED"] } } }, { $group: { _id: { $dateToString: { format: "%d %b", date: "$createdAt" } }, sales: { $sum: "$total" } } }, { $sort: { _id: 1 } }]),
  ]);
  const metrics = [["All orders", total], ["Needs your care", pending], ["Orders today", todayCount], ["Confirmed revenue", `₹${Number(revenue[0]?.total ?? 0).toLocaleString("en-IN")}`]];
  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Your business, at a glance</p><h1 className="font-display mt-2 text-5xl">A warm welcome.</h1></div><Link href="/admin/orders" className="btn-outline">View orders</Link></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([title, value]) => <div key={title as string} className="border border-[#e8e1d8] bg-[#fbf8f3] p-5"><p className="text-xs text-[#82776d]">{title as string}</p><p className="font-display mt-3 text-4xl">{value}</p></div>)}</div>
    <section className="mt-8 border border-[#e8e1d8] bg-[#fbf8f3] p-5"><div className="flex justify-between"><div><h2 className="font-display text-3xl">Sales, softly growing</h2><p className="mt-1 text-xs text-[#82776d]">Last seven days · accepted orders</p></div></div><SalesChart data={Array.from({ length: 7 }, (_, index) => { const day = new Date(sevenDaysAgo); day.setDate(day.getDate() + index); const label = day.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }); return { date: label, sales: Number(sales.find(item => item._id === label)?.sales ?? 0) }; })} /></section>
    <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]"><section className="border border-[#e8e1d8] bg-[#fbf8f3] p-5"><h2 className="font-display text-3xl">Recent orders</h2><div className="mt-5 overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b border-[#e8e1d8] text-[#82776d]"><th className="pb-3">Order</th><th className="pb-3">Customer</th><th className="pb-3">Total</th><th className="pb-3">Status</th></tr></thead><tbody>{recent.map(order => <tr key={String(order._id)} className="border-b border-[#eee8e1]"><td className="py-3">{order.orderNumber}</td><td>{order.customer.name}</td><td>₹{order.total.toLocaleString("en-IN")}</td><td>{order.status}</td></tr>)}</tbody></table></div><Link href="/admin/orders" className="mt-4 inline-block text-[10px] uppercase tracking-widest">All orders →</Link></section>
      <section className="border border-[#e8e1d8] bg-[#fbf8f3] p-5"><h2 className="font-display text-3xl">A gentle nudge</h2><p className="mt-1 text-xs text-[#82776d]">Low stock, before it runs out.</p>{lowStock.length ? <div className="mt-5 space-y-3">{lowStock.map(item => <div key={String(item._id)} className="flex justify-between border-b border-[#eee8e1] pb-3 text-sm"><span>{item.name}</span><span className="text-[#a85f45]">{item.stock} left</span></div>)}</div> : <p className="mt-6 text-sm text-[#82776d]">Everything is stocked up for now.</p>}</section></div>
  </div>;
}
