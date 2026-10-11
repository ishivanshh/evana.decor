"use client";
import { useState } from "react";
export function NewsletterForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(""); setError(""); setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email") }) });
      const data = await response.json();
      if (!response.ok) setError(data.error); else { setMessage(data.message); event.currentTarget.reset(); }
    } catch { setError("We couldn't sign you up just now. Please try again."); }
    finally { setBusy(false); }
  }
  return <div><form onSubmit={submit} className="mt-4 flex border-b border-[#85766a]"><input name="email" type="email" required placeholder="Your email address" className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#a99a8e]" /><button disabled={busy} className="text-[10px] uppercase tracking-widest">{busy ? "…" : "Join"}</button></form>{error && <p role="alert" className="mt-2 text-xs text-[#f2b4a8]">{error}</p>}{message && <p role="status" className="mt-2 text-xs text-[#d9cbbf]">{message}</p>}</div>;
}
