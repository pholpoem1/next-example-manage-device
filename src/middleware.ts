import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;

  try {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
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
