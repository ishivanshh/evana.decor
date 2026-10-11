import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/lib/models";
import { rateLimit, requestIp } from "@/lib/rate-limit";

const schema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254), subject: z.string().trim().min(2).max(120), message: z.string().trim().min(10).max(3000) });
export async function POST(request: Request) {
  if (!rateLimit(`contact:${requestIp(request)}`, 5, 60_000).allowed) return NextResponse.json({ error: "Please wait before sending another message." }, { status: 429 });
  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Please complete each field with valid details." }, { status: 400 });
  await connectDB();
  await ContactMessage.create(input.data);
  return NextResponse.json({ message: "Thank you. Your note is with our team." }, { status: 201 });
}
