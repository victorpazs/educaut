import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "@/lib/auth";

const publicPaths = ["/auth/login", "/auth/register", "/api/auth"];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isPublic = publicPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isPublic) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const payload = await verifyJwt(token).catch(() => null);
  if (!payload) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

// Match all app routes except static assets
export const config = {
  matcher: ["/((?!_next|favicon.ico|assets).*)"],
};
