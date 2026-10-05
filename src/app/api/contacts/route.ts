import { NextResponse } from "next/server";
import { connectDB } from "@/server/db/connect";
import EventProposal from "@/server/models/EventProposal";

// GET /api/contacts -> host name and phone for each approved event whose host allows it
export async function GET() {
  await connectDB();
  const events = await EventProposal.find({ status: "APPROVED", showContact: { $ne: false } })
    .select("title category proposerName proposerPhone")
    .sort({ title: 1 })
    .lean();

  return NextResponse.json(
    {
      contacts: events.map((e) => ({
        eventId: String(e._id),
        eventTitle: e.title,
        category: e.category,
        hostName: e.proposerName,
        hostPhone: e.proposerPhone,
      })),
    },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
  );
}
