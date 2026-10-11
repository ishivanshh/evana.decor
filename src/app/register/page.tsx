"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function safeCallback(value: string | null) { return value?.startsWith("/") && !value.startsWith("//") ? value : "/"; }

export default function CustomerRegisterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    const credentials = { name: String(form.get("name") ?? ""), email: String(form.get("email") ?? ""), password: String(form.get("password") ?? "") };
    try {
      const response = await fetch("/api/customers/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(credentials) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "We couldn't create your account.");
      const signedIn = await signIn("customer-credentials", { email: credentials.email, password: credentials.password, redirect: false });
      if (signedIn?.error) throw new Error("Your account was created, but we couldn't sign you in. Please sign in with your new account.");
      router.replace(safeCallback(params.get("callbackUrl")));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "We couldn't create your account."); setBusy(false); }
  }
  return <main className="container-page flex min-h-[70vh] items-center justify-center py-14"><form onSubmit={submit} className="w-full max-w-sm border border-[#e8e1d8] bg-[#fbf8f3] p-8 shadow-sm"><p className="eyebrow text-center">A little more personal</p><h1 className="font-display mt-3 text-center text-4xl">Create your account.</h1><label className="mt-7 block text-xs">Your name<input required name="name" minLength={2} maxLength={80} autoComplete="name" className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-3 outline-none focus:border-[#a85f45]" /></label><label className="mt-4 block text-xs">Email<input required name="email" type="email" autoComplete="email" className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-3 outline-none focus:border-[#a85f45]" /></label><label className="mt-4 block text-xs">Password<input required name="password" type="password" minLength={8} maxLength={128} autoComplete="new-password" className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-3 outline-none focus:border-[#a85f45]" /><span className="mt-1 block text-[10px] text-[#82776d]">Use at least 8 characters.</span></label>{error && <p role="alert" className="mt-4 text-xs text-red-700">{error}</p>}<button disabled={busy} className="btn-primary mt-6 w-full">{busy ? "Creating account…" : "Create account"}</button><p className="mt-5 text-center text-xs text-[#82776d]">Already have an account? <Link href={`/login?callbackUrl=${encodeURIComponent(safeCallback(params.get("callbackUrl")))}`} className="underline">Sign in</Link></p></form></main>;
}
