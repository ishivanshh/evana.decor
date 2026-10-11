"use client";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
export function SalesChart({ data }: { data: { date: string; sales: number }[] }) {
  return <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 8, right: 14, bottom: 0, left: -16 }}><CartesianGrid stroke="#e8e1d8" vertical={false} /><XAxis dataKey="date" tick={{ fontSize: 10, fill: "#82776d" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 10, fill: "#82776d" }} axisLine={false} tickLine={false} /><Tooltip formatter={value => [`₹${Number(value).toLocaleString("en-IN")}`, "Sales"]} contentStyle={{ border: "1px solid #e8e1d8", background: "#fbf8f3", fontSize: 12 }} /><Line type="monotone" dataKey="sales" stroke="#a85f45" strokeWidth={2} dot={{ r: 3, fill: "#a85f45" }} /></LineChart></ResponsiveContainer></div>;
}
