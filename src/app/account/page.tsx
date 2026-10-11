"use client";

import Link from "next/link";
import { signOut, getSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Account = { name?: string | null; email?: string | null; role?: string };
export default function AccountPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { getSession().then(session => { setAccount(session?.user as Account | undefined ?? null); setLoaded(true); }); }, []);
  if (!loaded) return <div className="container-page min-h-[60vh] py-16"><p className="eyebrow">Your Evana account</p><p className="mt-6 text-sm text-[#82776d]">Loading account…</p></div>;
  if (!account || account.role !== "customer") return <div className="container-page min-h-[60vh] py-16"><p className="eyebrow">Your Evana account</p><h1 className="font-display mt-3 text-5xl">Welcome in.</h1><p className="mt-4 text-sm text-[#82776d]">Sign in to continue to checkout and manage your account.</p><div className="mt-7 flex gap-3"><Link href="/login" className="btn-primary">Sign in</Link><Link href="/register" className="btn-outline">Create account</Link></div></div>;
  return <div className="container-page min-h-[60vh] py-16"><p className="eyebrow">Your Evana account</p><h1 className="font-display mt-3 text-5xl">Hello, {account.name}.</h1><p className="mt-4 text-sm text-[#82776d]">{account.email}</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/track-order" className="btn-outline">Track an order</Link><button onClick={() => void signOut({ callbackUrl: "/" })} className="btn-outline">Sign out</button></div></div>;
}
