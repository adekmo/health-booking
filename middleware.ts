import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 1. Public routes (tidak butuh login)
  const publicPaths = ["/", "/auth/signin", "/auth/register", "/about", "/contact"];
  if (publicPaths.includes(pathname)) return NextResponse.next();

  // 2. Kalau tidak ada token → redirect ke login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // 3. Role-based protection
  const role = token.role;

  // Admin dashboard
  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Nutritionist dashboard
  if (pathname.startsWith("/dashboard/nutritionist") && role !== "nutritionist") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", // semua halaman dashboard diproteksi
  ],
};
