"use client";

import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CheckoutLink({
  className,
  children,
  onNavigate,
}: {
  className: string;
  children: React.ReactNode;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function continueToCheckout() {
    setBusy(true);
    setError("");
    try {
      const session = await getSession();
      onNavigate?.();
      if (session?.user?.role === "customer") {
        router.push("/checkout");
      } else {
        router.push(`/login?callbackUrl=${encodeURIComponent("/checkout")}`);
      }
    } catch {
      setError("We couldn't verify your sign-in. Please try again.");
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" onClick={() => void continueToCheckout()} disabled={busy} className={`${className} disabled:opacity-60`}>
        {busy ? "Checking account…" : children}
      </button>
      {error && <p role="alert" className="mt-2 text-center text-xs text-red-800">{error}</p>}
    </>
  );
}
