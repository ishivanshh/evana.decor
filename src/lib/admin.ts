import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") return null;
  return session;
}
export function unauthorized() {
  return NextResponse.json({ error: "You must be signed in as the store owner." }, { status: 401 });
}
