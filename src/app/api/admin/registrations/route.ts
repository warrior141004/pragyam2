import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connect";
import { isAdminRequest } from "@/server/auth/adminAuth";
import Registration from "@/server/models/Registration";
// populate("event") needs this model registered, even though it is not used directly here.
import "@/server/models/EventProposal";

export async function GET(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();

  const eventId = req.nextUrl.searchParams.get("eventId");
  const query: Record<string, unknown> = {};
  if (eventId) query.event = eventId;

  const registrations = await Registration.find(query)
    .populate("event", "title maxParticipants")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    registrations: registrations.map((r) => ({ ...r, _id: String(r._id) })),
  });
}
