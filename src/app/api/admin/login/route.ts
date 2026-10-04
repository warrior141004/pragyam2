import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/server/auth/adminAuth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Admin access is not configured on the server" },
      { status: 500 }
    );
  }

  if (password !== secret) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}
