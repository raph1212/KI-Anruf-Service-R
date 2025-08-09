import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  if (url.pathname.startsWith("/admin")) {
    const cookie = req.cookies.get("admin_auth")?.value;
    if (cookie === "ok") return NextResponse.next();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
