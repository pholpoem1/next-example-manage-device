import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const pathname = request.nextUrl.pathname;

  try {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname === "/" && token) {
      return NextResponse.redirect(new URL("/devices", request.url));
    }

    NextResponse.next();
  } catch (error) {
    console.log("error :>> ", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/devices/:path*", "/api/devices/:path*"]
};
