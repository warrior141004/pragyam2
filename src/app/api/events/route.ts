import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connect";
import EventProposal, { CATEGORIES } from "@/server/models/EventProposal";
import Registration from "@/server/models/Registration";
import { sendProposalReceivedEmail } from "@/server/mail/email";

// GET /api/events -> list approved events (with search/category filter)
export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const query: Record<string, unknown> = { status: "APPROVED" };
  if (category && category !== "All") query.category = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const events = await EventProposal.find(query).sort({ createdAt: -1 }).lean();
  const counts = await Registration.aggregate([
    { $group: { _id: "$event", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c.count]));

  const dto = events.map((e) => ({
    _id: String(e._id),
    title: e.title,
    category: e.category,
    description: e.description,
    rules: e.rules,
    proposerName: e.proposerName,
    maxParticipants: e.maxParticipants,
    approvedCount: countMap.get(String(e._id)) || 0,
    duration: e.duration,
    venue: e.venue,
    venueRequirements: e.venueRequirements,
    preferredDate: e.preferredDate,
    preferredTime: e.preferredTime,
    registrationsClosed: e.registrationsClosed,
    registrationQuestions: e.registrationQuestions ?? [],
    teamMinSize: e.teamMinSize ?? 1,
    teamMaxSize: e.teamMaxSize ?? 1,
    status: e.status,
    createdAt: e.createdAt,
  }));

  return NextResponse.json(
    { events: dto },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600" } }
  );
}

// POST /api/events -> submit a new proposal (status PENDING)
export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  const required = [
    "proposerName",
    "proposerEmail",
    "proposerPhone",
    "title",
    "category",
    "description",
    "expectedParticipants",
    "maxParticipants",
  ];
  for (const field of required) {
    if (!body[field] && body[field] !== 0) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  if (!CATEGORIES.includes(body.category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.proposerEmail)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const expected = Number(body.expectedParticipants);
  const max = Number(body.maxParticipants);
  if (!Number.isFinite(expected) || expected < 1 || !Number.isFinite(max) || max < 1) {
    return NextResponse.json(
      { error: "Participant counts must be positive numbers" },
      { status: 400 }
    );
  }

  const proposal = await EventProposal.create({
    proposerName: body.proposerName,
    proposerEmail: body.proposerEmail,
    proposerPhone: body.proposerPhone,
    title: body.title,
    category: body.category,
    description: body.description,
    rules: body.rules || "",
    expectedParticipants: expected,
    maxParticipants: max,
    duration: body.duration || "",
    venueRequirements: body.venueRequirements || "",
    equipmentRequirements: body.equipmentRequirements || "",
    preferredDate: body.preferredDate || "",
    preferredTime: body.preferredTime || "",
    additionalInfo: body.additionalInfo || "",
  });

  // No manage key yet: it is issued only when an admin approves the proposal.
  await sendProposalReceivedEmail({
    to: proposal.proposerEmail,
    hostName: proposal.proposerName,
    eventTitle: proposal.title,
  });

  return NextResponse.json({ id: String(proposal._id) }, { status: 201 });
}
