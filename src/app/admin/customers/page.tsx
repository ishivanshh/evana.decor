"use client";
import { useEffect, useState } from "react";
type Customer = { _id: string; name: string; email: string; phone: string; orders: number; spent: number; lastOrder: string };
export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  useEffect(() => { void fetch("/api/admin/customers").then(response => response.json()).then(data => setCustomers(data.customers ?? [])); }, []);
  return <div><p className="eyebrow">The people who love Evana</p><h1 className="font-display mt-2 text-5xl">Customers</h1><div className="mt-7 overflow-x-auto border border-[#e8e1d8] bg-[#fbf8f3]"><table className="w-full min-w-[650px] text-left text-xs"><thead><tr className="border-b border-[#e8e1d8] text-[#82776d]"><th className="p-4">Customer</th><th className="p-4">Phone</th><th className="p-4">Orders</th><th className="p-4">Total spent</th><th className="p-4">Last order</th></tr></thead><tbody>{customers.map(customer => <tr key={customer._id} className="border-b border-[#eee8e1]"><td className="p-4">{customer.name}<p className="mt-1 text-[#82776d]">{customer.email}</p></td><td className="p-4">{customer.phone}</td><td className="p-4">{customer.orders}</td><td className="p-4">₹{customer.spent.toLocaleString("en-IN")}</td><td className="p-4">{new Date(customer.lastOrder).toLocaleDateString("en-IN")}</td></tr>)}</tbody></table>{customers.length === 0 && <p className="p-8 text-center text-sm text-[#82776d]">Customer orders will appear here.</p>}</div></div>;
}
