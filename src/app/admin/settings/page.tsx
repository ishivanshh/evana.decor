"use client";
import { useEffect, useState } from "react";
type Settings = { storeName: string; shippingCharge: number; freeShippingThreshold: number; codCharge: number; whatsappNumber: string };
export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({ storeName: "Evana", shippingCharge: 99, freeShippingThreshold: 1999, codCharge: 0, whatsappNumber: "" });
  const [message, setMessage] = useState("");
  useEffect(() => { void fetch("/api/admin/settings").then(response => response.json()).then(data => setSettings(data.settings)); }, []);
  function change(key: keyof Settings, value: string) { setSettings(current => ({ ...current, [key]: key === "storeName" || key === "whatsappNumber" ? value : Number(value) })); }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("");
    const response = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    const result = await response.json(); setMessage(response.ok ? "Settings saved." : result.error);
  }
  return <div><p className="eyebrow">The way you do things</p><h1 className="font-display mt-2 text-5xl">Store settings</h1><form onSubmit={save} className="mt-7 max-w-2xl border border-[#e8e1d8] bg-[#fbf8f3] p-6">{([["storeName","Store name"],["shippingCharge","Standard shipping charge (₹)"],["freeShippingThreshold","Free shipping threshold (₹)"],["codCharge","COD charge (₹)"],["whatsappNumber","WhatsApp number (country code + number)"]] as const).map(([key,label]) => <label key={key} className="mt-4 block text-xs">{label}<input required type={key === "storeName" || key === "whatsappNumber" ? "text" : "number"} min={key === "storeName" || key === "whatsappNumber" ? undefined : 0} value={settings[key]} onChange={event => change(key, event.target.value)} className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-3 outline-none" /></label>)}{message && <p role="status" className="mt-4 text-sm">{message}</p>}<button className="btn-primary mt-6">Save settings</button></form></div>;
}
