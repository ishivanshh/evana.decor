"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type AdminOrder = { _id: string; orderNumber: string; customer: { name: string; phone: string; email: string }; total: number; status: string; createdAt: string; items: { name: string; quantity: number }[] };
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [status, setStatus] = useState("ALL");
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    const params = new URLSearchParams({ status, q: query });
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const response = await fetch(`/api/admin/orders?${params}`);
    const result = await response.json();
    if (response.ok) { setOrders(result.orders); setError(""); } else setError(result.error ?? "Unable to load orders.");
  }, [status, query, from, to]);
  useEffect(() => { void load(); const timer = window.setInterval(() => void load(), 20_000); return () => window.clearInterval(timer); }, [load]);
  async function updateOrder(orderNumber: string, nextStatus: string) {
    let reason: string | undefined;
    if (nextStatus === "REJECTED") { reason = window.prompt("Please enter the reason for rejection:")?.trim(); if (!reason) return; }
    setError("");
    const response = await fetch(`/api/admin/orders/${orderNumber}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: nextStatus, reason }) });
    const result = await response.json();
    if (!response.ok) setError(result.error ?? "Unable to update order.");
    else await load();
  }
  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">A closer look</p><h1 className="font-display mt-2 text-5xl">Orders</h1></div><button onClick={() => { window.location.href = "/api/admin/orders/export"; }} className="btn-outline">Export CSV</button></div><div className="mt-7 flex flex-wrap gap-3"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search order, name, or phone" className="min-w-56 flex-1 border border-[#ded5cb] bg-[#fbf8f3] px-3 py-2 text-sm outline-none" /><select value={status} onChange={e => setStatus(e.target.value)} className="border border-[#ded5cb] bg-[#fbf8f3] px-3 py-2 text-sm"><option value="ALL">All statuses</option>{["PENDING", "ACCEPTED", "SHIPPED", "DELIVERED", "REJECTED", "CANCELLED"].map(value => <option key={value}>{value}</option>)}</select><label className="flex items-center gap-2 text-[10px] text-[#82776d]">From<input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border border-[#ded5cb] bg-[#fbf8f3] px-2 py-2 text-xs" /></label><label className="flex items-center gap-2 text-[10px] text-[#82776d]">To<input type="date" value={to} onChange={e => setTo(e.target.value)} className="border border-[#ded5cb] bg-[#fbf8f3] px-2 py-2 text-xs" /></label></div>
    {error && <p role="alert" className="mt-4 bg-[#f8e4df] p-3 text-sm text-red-800">{error}</p>}
    <div className="mt-5 overflow-x-auto border border-[#e8e1d8] bg-[#fbf8f3]"><table className="w-full min-w-[850px] text-left text-xs"><thead><tr className="border-b border-[#e8e1d8] text-[#82776d]"><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Items</th><th className="p-4">Total</th><th className="p-4">Date</th><th className="p-4">Status</th><th className="p-4">Update</th></tr></thead><tbody>{orders.map(order => <tr key={order._id} className="border-b border-[#eee8e1] align-top"><td className="p-4"><Link href={`/admin/orders/${order.orderNumber}`} className="underline">{order.orderNumber}</Link></td><td className="p-4">{order.customer.name}<p className="mt-1 text-[#82776d]">{order.customer.phone}</p><p className="text-[#82776d]">{order.customer.email}</p></td><td className="p-4">{order.items.map(item => `${item.name} ×${item.quantity}`).join(", ")}</td><td className="p-4">₹{order.total.toLocaleString("en-IN")}</td><td className="p-4">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td><td className="p-4">{order.status}</td><td className="p-4">{order.status === "PENDING" && <div className="flex gap-2"><button onClick={() => void updateOrder(order.orderNumber, "ACCEPTED")} className="text-green-800 underline">Accept</button><button onClick={() => void updateOrder(order.orderNumber, "REJECTED")} className="text-red-800 underline">Reject</button></div>}{order.status === "ACCEPTED" && <button onClick={() => void updateOrder(order.orderNumber, "SHIPPED")} className="underline">Mark shipped</button>}{order.status === "SHIPPED" && <button onClick={() => void updateOrder(order.orderNumber, "DELIVERED")} className="underline">Mark delivered</button>}{["PENDING", "ACCEPTED"].includes(order.status) && <button onClick={() => void updateOrder(order.orderNumber, "CANCELLED")} className="mt-2 block text-[#82776d] underline">Cancel</button>}</td></tr>)}</tbody></table>{orders.length === 0 && <p className="p-8 text-center text-sm text-[#82776d]">No orders to show yet.</p>}</div>
  </div>;
}
