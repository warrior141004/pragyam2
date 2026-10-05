import { NextRequest, NextResponse } from "next/server";
import { authorizeHost } from "@/server/auth/hostAuth";
import { CATEGORIES } from "@/server/models/EventProposal";
import Registration from "@/server/models/Registration";

type Ctx = { params: Promise<{ id: string }> };

// Free-text fields the host may edit, with max lengths.
const TEXT: Record<string, number> = {
  proposerName: 120,
  proposerPhone: 30,
  title: 150,
  description: 5000,
  rules: 5000,
  duration: 100,
  venueRequirements: 500,
  equipmentRequirements: 500,
  preferredDate: 30,
  preferredTime: 30,
  additionalInfo: 3000,
};
const REQUIRED = ["proposerName", "proposerPhone", "title", "description"];

// GET: the host's full event plus its participants.
export async function GET(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const auth = await authorizeHost(req, id);
  if (auth.error) return auth.error;

  const registrations = await Registration.find({ event: id }).sort({ createdAt: -1 }).lean();
  const { manageKeyHash: _h, ...event } = auth.event.toObject();
  void _h;

  return NextResponse.json(
    { event: { ...event, _id: String(event._id) }, registrations: registrations.map((r) => ({ ...r, _id: String(r._id), event: String(r.event) })) },
    { headers: { "Cache-Control": "no-store" } }
  );
}

// PATCH: edit the details the host originally filled in. Status and admin-set venue are not editable here.
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const auth = await authorizeHost(req, id);
  if (auth.error) return auth.error;
  const event = auth.event;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  for (const [field, max] of Object.entries(TEXT)) {
    if (!(field in body)) continue;
    const value = String(body[field] ?? "").trim();
    if (REQUIRED.includes(field) && !value) {
      return NextResponse.json({ error: `${field} cannot be empty` }, { status: 400 });
    }
    if (value.length > max) {
      return NextResponse.json({ error: `${field} is too long (max ${max} characters)` }, { status: 400 });
    }
    updates[field] = value;
  }

  if ("proposerEmail" in body) {
    const email = String(body.proposerEmail ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    updates.proposerEmail = email;
  }

  if ("category" in body) {
    if (!(CATEGORIES as readonly string[]).includes(String(body.category))) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    updates.category = body.category;
  }

  if ("expectedParticipants" in body) {
    const n = Number(body.expectedParticipants);
    if (!Number.isInteger(n) || n < 1) {
      return NextResponse.json({ error: "Expected participants must be a positive whole number" }, { status: 400 });
    }
    updates.expectedParticipants = n;
  }

  if ("maxParticipants" in body) {
    const n = Number(body.maxParticipants);
    if (!Number.isInteger(n) || n < 1) {
      return NextResponse.json({ error: "Maximum participants must be a positive whole number" }, { status: 400 });
    }
    const registered = await Registration.countDocuments({ event: id });
    if (n < registered) {
      return NextResponse.json(
        { error: `Maximum can't be below the ${registered} participants already registered` },
        { status: 400 }
      );
    }
    updates.maxParticipants = n;
  }

  if ("registrationsClosed" in body) {
    updates.registrationsClosed = Boolean(body.registrationsClosed);
  }

  event.set(updates);
  await event.save();

  return NextResponse.json({ ok: true });
}
