import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "fb_token";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // protect admin routes
  if (!(pathname === "/admin" || pathname.startsWith("/admin/"))) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Token exists; allow through. Full validation happens server-side.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
