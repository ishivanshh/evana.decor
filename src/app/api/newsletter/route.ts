import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Newsletter } from "@/lib/models";
import { rateLimit, requestIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!rateLimit(`newsletter:${requestIp(request)}`, 5, 60_000).allowed) return NextResponse.json({ error: "Please try again shortly." }, { status: 429 });
  let email: unknown;
  if (request.headers.get("content-type")?.includes("application/json")) email = (await request.json().catch(() => ({}))).email;
  else email = (await request.formData().catch(() => new FormData())).get("email");
  const parsed = z.string().trim().email().max(254).safeParse(email);
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  await connectDB();
  await Newsletter.updateOne({ email: parsed.data.toLowerCase() }, { $setOnInsert: { email: parsed.data.toLowerCase() } }, { upsert: true });
  return NextResponse.json({ message: "You're on the list. Welcome to the slow side." }, { status: 201 });
}
