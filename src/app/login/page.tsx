"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function safeCallback(value: string | null) { return value?.startsWith("/") && !value.startsWith("//") ? value : "/"; }

export default function CustomerLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    const result = await signIn("customer-credentials", { email: form.get("email"), password: form.get("password"), redirect: false });
    if (result?.error) { setError("Those details don't match a customer account."); setBusy(false); return; }
    router.replace(safeCallback(params.get("callbackUrl")));
  }
  return <main className="container-page flex min-h-[70vh] items-center justify-center py-14"><form onSubmit={submit} className="w-full max-w-sm border border-[#e8e1d8] bg-[#fbf8f3] p-8 shadow-sm"><p className="eyebrow text-center">Your Evana account</p><h1 className="font-display mt-3 text-center text-4xl">Welcome back.</h1><label className="mt-7 block text-xs">Email<input required name="email" type="email" autoComplete="email" className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-3 outline-none focus:border-[#a85f45]" /></label><label className="mt-4 block text-xs">Password<input required name="password" type="password" autoComplete="current-password" className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-3 outline-none focus:border-[#a85f45]" /></label>{error && <p role="alert" className="mt-4 text-xs text-red-700">{error}</p>}<button disabled={busy} className="btn-primary mt-6 w-full">{busy ? "Signing in…" : "Sign in"}</button><p className="mt-5 text-center text-xs text-[#82776d]">New here? <Link href={`/register?callbackUrl=${encodeURIComponent(safeCallback(params.get("callbackUrl")))}`} className="underline">Create an account</Link></p></form></main>;
}
