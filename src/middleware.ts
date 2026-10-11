import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminLogin = pathname === "/admin/login";
  const isCustomerAuth = pathname === "/login" || pathname === "/register";
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (pathname.startsWith("/admin") && !isAdminLogin && token?.role !== "admin") {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }
  if (pathname.startsWith("/admin") && isAdminLogin && token?.role === "admin") return NextResponse.redirect(new URL("/admin", request.url));
  if ((pathname === "/checkout" || pathname === "/feedback") && token?.role !== "customer") {
    const login = new URL("/login", request.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }
  if (isCustomerAuth && token?.role === "customer") {
    const requested = request.nextUrl.searchParams.get("callbackUrl");
    const destination = requested?.startsWith("/") && !requested.startsWith("//") ? requested : "/";
    return NextResponse.redirect(new URL(destination, request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/checkout", "/feedback", "/login", "/register"] };
