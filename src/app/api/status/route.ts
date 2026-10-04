import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connect";
import EventProposal from "@/server/models/EventProposal";
import Registration from "@/server/models/Registration";

export async function GET(req: NextRequest) {
  await connectDB();
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const proposals = await EventProposal.find({ proposerEmail: email })
    .sort({ createdAt: -1 })
    .lean();

  const registrations = await Registration.find({ participantEmail: email })
    .populate("event", "title")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    proposals: proposals.map((p) => ({
      _id: String(p._id),
      title: p.title,
      status: p.status,
      rejectionReason: p.rejectionReason,
      createdAt: p.createdAt,
    })),
    registrations: registrations.map((r) => ({
      _id: String(r._id),
      eventTitle:
        r.event && typeof r.event === "object" && "title" in r.event
          ? (r.event as { title: string }).title
          : "Unknown event",
      status: r.status,
      createdAt: r.createdAt,
    })),
  });
}
