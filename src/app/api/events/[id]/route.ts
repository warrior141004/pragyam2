import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/server/db/connect";
import EventProposal from "@/server/models/EventProposal";
import Registration from "@/server/models/Registration";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid event id" }, { status: 400 });
  }

  const event = await EventProposal.findOne({ _id: id, status: "APPROVED" }).lean();
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const approvedCount = await Registration.countDocuments({ event: id });

  return NextResponse.json({
    event: {
      _id: String(event._id),
      title: event.title,
      category: event.category,
      description: event.description,
      rules: event.rules,
      proposerName: event.proposerName,
      proposerEmail: event.proposerEmail,
      maxParticipants: event.maxParticipants,
      approvedCount,
      duration: event.duration,
      venue: event.venue,
      venueRequirements: event.venueRequirements,
      preferredDate: event.preferredDate,
      preferredTime: event.preferredTime,
      registrationsClosed: event.registrationsClosed,
      status: event.status,
      createdAt: event.createdAt,
    },
  }, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300" } });
}
