"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", { email: form.get("email"), password: form.get("password"), redirect: false });
    if (result?.error) { setError("Those details don’t match our owner account."); setBusy(false); return; }
    const callbackUrl = params.get("callbackUrl");
    router.replace(callbackUrl?.startsWith("/admin") ? callbackUrl : "/admin");
  }
  return <main className="flex min-h-screen items-center justify-center px-5"><form onSubmit={submit} className="w-full max-w-sm border border-[#e8e1d8] bg-[#fbf8f3] p-8 shadow-sm"><Link href="/" className="font-display block text-center text-4xl tracking-[.15em]">evana</Link><p className="eyebrow mt-2 text-center">Owner studio</p><h1 className="font-display mt-8 text-center text-3xl">Welcome back.</h1><label className="mt-7 block text-xs">Email<input required name="email" type="email" autoComplete="username" className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-3 outline-none focus:border-[#a85f45]" /></label><label className="mt-4 block text-xs">Password<input required name="password" type="password" autoComplete="current-password" className="mt-2 w-full border border-[#ded5cb] bg-white px-3 py-3 outline-none focus:border-[#a85f45]" /></label>{error && <p role="alert" className="mt-4 text-xs text-red-700">{error}</p>}<button disabled={busy} className="btn-primary mt-6 w-full">{busy ? "Signing in…" : "Sign in"}</button></form></main>;
}
