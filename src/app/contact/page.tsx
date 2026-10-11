"use client";

import { useState } from "react";

export default function ContactPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
    const result = await response.json();
    if (!response.ok) setError(result.error); else { setMessage(result.message); event.currentTarget.reset(); }
  }
  return <div className="container-page min-h-[65vh] py-20"><div className="mx-auto max-w-xl"><p className="eyebrow">We’re here for you</p><h1 className="font-display mt-3 text-6xl">Say hello.</h1><p className="mt-4 text-sm leading-7 text-[#82776d]">A question about a scent, a parcel, or just a little note? We’d love to hear from you.</p><form onSubmit={submit} className="mt-8 grid gap-4">{[["name","Your name","text"],["email","Email address","email"],["subject","Subject","text"]].map(([name,label,type]) => <label className="text-xs" key={name}>{label}<input required name={name} type={type} className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-3 outline-none focus:border-[#a85f45]" /></label>)}<label className="text-xs">Your message<textarea required name="message" rows={5} className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-3 outline-none focus:border-[#a85f45]" /></label>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}{message && <p role="status" className="text-sm text-green-800">{message}</p>}<button className="btn-primary">Send your note</button></form></div></div>;
}
