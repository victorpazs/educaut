import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { homeRoute, loginRoute } from "./lib/contraints";

const publicPaths = [
  loginRoute,
  "/auth/register",
  "/auth/logout",
  "/auth/verify-email",
  "/auth/password-recovery",
];
const publicPathsRedirectingAuthenticated = [loginRoute, "/auth/register"];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isPublic = publicPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );

  if (isPublic) {
    const shouldRedirectHome = publicPathsRedirectingAuthenticated.some(
      (path) => req.nextUrl.pathname.startsWith(path),
    );

    if (shouldRedirectHome && !!token) {
      return NextResponse.redirect(new URL(homeRoute, req.url));
    }

    return NextResponse.next();
  }
  if (!token) {
    const response = NextResponse.redirect(new URL(loginRoute, req.url));
    response.cookies.delete("token");
    response.cookies.delete("selected_school");
    return response;
  }

  const payload = await verifyJwt(token);

  if (!payload || !payload.success || !payload.data) {
    const response = NextResponse.redirect(new URL(loginRoute, req.url));
    response.cookies.delete("token");
    response.cookies.delete("selected_school");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|robots.txt|sitemap.xml|assets|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml)$).*)",
  ],
};
