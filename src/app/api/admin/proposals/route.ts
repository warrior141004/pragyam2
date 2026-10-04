import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connect";
import { isAdminRequest } from "@/server/auth/adminAuth";
import EventProposal from "@/server/models/EventProposal";

export async function GET(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();

  const status = req.nextUrl.searchParams.get("status");
  const query: Record<string, unknown> = {};
  if (status && ["PENDING", "APPROVED", "REJECTED"].includes(status)) {
    query.status = status;
  }

  const proposals = await EventProposal.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json({
    proposals: proposals.map((p) => ({ ...p, _id: String(p._id) })),
  });
}
