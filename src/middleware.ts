import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const isLogin = request.nextUrl.pathname === "/admin/login";
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!isLogin && token?.role !== "admin") {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  if (isLogin && token?.role === "admin") return NextResponse.redirect(new URL("/admin", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
