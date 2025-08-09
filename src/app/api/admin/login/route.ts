import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.headers.set("Set-Cookie", serialize("admin_auth", "ok", { path: "/", httpOnly: true, sameSite: "lax", secure: true, maxAge: 60*60*12 }));
    return res;
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
