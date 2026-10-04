import { NextResponse } from "next/server";
import { isAdminRequest } from "@/server/auth/adminAuth";

export async function GET() {
  const ok = await isAdminRequest();
  return NextResponse.json({ authenticated: ok });
}
