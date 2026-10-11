import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { rateLimit, requestIp } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  if (!rateLimit(`customer-register:${requestIp(request)}`, 5, 60_000).allowed) {
    return NextResponse.json({ error: "Please wait before creating another account." }, { status: 429 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid name, email, and password of at least 8 characters." }, { status: 400 });
  await connectDB();
  if (await User.exists({ email: parsed.data.email })) return NextResponse.json({ error: "An account with this email already exists. Please sign in instead." }, { status: 409 });
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await User.create({ ...parsed.data, passwordHash, role: "customer" });
  return NextResponse.json({ message: "Your account has been created." }, { status: 201 });
}
