import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { homeRoute, loginRoute } from "./lib/contraints";

const publicPaths = [loginRoute, "/auth/register"];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isPublic = publicPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isPublic) {
    if (!!token) {
      return NextResponse.redirect(new URL(homeRoute, req.url));
    } else return NextResponse.next();
  }
  if (!token) {
    return NextResponse.redirect(new URL(loginRoute, req.url));
  }

  const payload = await verifyJwt(token);

  if (!payload || !payload.success || !payload.data) {
    return NextResponse.redirect(new URL(loginRoute, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|assets).*)"],
};
