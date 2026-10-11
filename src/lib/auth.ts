import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { rateLimit } from "@/lib/rate-limit";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [CredentialsProvider({
    name: "Owner credentials",
    credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
    async authorize(credentials, request) {
      const source = request.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ?? "unknown";
      if (!rateLimit(`admin-login:${source}`, 10, 15 * 60_000).allowed) return null;
      const parsed = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(128) }).safeParse(credentials);
      if (!parsed.success) return null;
      await connectDB();
      const user = await User.findOne({ email: parsed.data.email.toLowerCase(), role: "admin" }).lean();
      if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return null;
      return { id: String(user._id), name: user.name, email: user.email, role: "admin" };
    },
  })],
  callbacks: {
    async jwt({ token, user }) { if (user) token.role = (user as typeof user & { role?: string }).role; return token; },
    async session({ session, token }) { if (session.user) (session.user as typeof session.user & { role?: string }).role = token.role as string; return session; },
  },
};
