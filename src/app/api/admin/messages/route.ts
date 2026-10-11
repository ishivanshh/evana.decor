import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/lib/models";
import { requireAdmin, unauthorized } from "@/lib/admin";
export async function GET() {
  if (!await requireAdmin()) return unauthorized();
  await connectDB();
  const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(300).lean();
  return NextResponse.json({ messages });
}
