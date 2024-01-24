import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const pathname = request.nextUrl.pathname;

  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/devices", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else if (
    pathname.startsWith("/devices") ||
    pathname.startsWith("/api/devices")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
  return NextResponse.next();
}

// export const config = {
//   matcher: "/"
// };
