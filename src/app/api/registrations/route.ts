import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/server/db/connect";
import EventProposal from "@/server/models/EventProposal";
import Registration from "@/server/models/Registration";
import { sendNewRegistrationEmailToHost, sendRegistrationConfirmationEmail } from "@/server/mail/email";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  const required = ["eventId", "participantName", "participantEmail", "participantPhone"];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  if (!mongoose.Types.ObjectId.isValid(body.eventId)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.participantEmail)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const teamRequired = Boolean(body.teamRequired);
  const teamMembers: { name: string; enrollmentNo: string }[] = teamRequired && Array.isArray(body.teamMembers)
    ? body.teamMembers
        .map((m: { name?: unknown; enrollmentNo?: unknown }) => ({
          name: String(m?.name ?? "").trim(),
          enrollmentNo: String(m?.enrollmentNo ?? "").trim(),
        }))
        .filter((m: { name: string }) => m.name)
    : [];
  const additionalNote = typeof body.additionalNote === "string" ? body.additionalNote.trim() : "";

  const event = await EventProposal.findById(body.eventId);
  if (!event || event.status !== "APPROVED") {
    return NextResponse.json(
      { error: "This event is not open for registration" },
      { status: 400 }
    );
  }
  if (event.registrationsClosed) {
    return NextResponse.json(
      { error: "Registrations for this event are closed" },
      { status: 400 }
    );
  }

  const currentCount = await Registration.countDocuments({ event: event._id });
  if (currentCount >= event.maxParticipants) {
    return NextResponse.json(
      { error: "This event has reached its maximum participant limit" },
      { status: 400 }
    );
  }

  try {
    const registration = await Registration.create({
      event: event._id,
      participantName: body.participantName,
      participantEmail: body.participantEmail,
      participantPhone: body.participantPhone,
      teamRequired,
      teamMembers,
      additionalNote,
    });

    // Registration is already saved; email helpers never throw, so a mail failure can't undo it.
    await Promise.all([
      sendNewRegistrationEmailToHost({
        to: event.proposerEmail,
        hostName: event.proposerName,
        eventTitle: event.title,
        participantName: registration.participantName,
        participantEmail: registration.participantEmail,
        participantPhone: registration.participantPhone,
        teamMembers,
        additionalNote,
        registeredCount: currentCount + 1,
        maxParticipants: event.maxParticipants,
      }),
      sendRegistrationConfirmationEmail({
        to: registration.participantEmail,
        participantName: registration.participantName,
        eventTitle: event.title,
        eventId: String(event._id),
      }),
    ]);

    return NextResponse.json({ id: String(registration._id) }, { status: 201 });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return NextResponse.json(
        { error: "You have already registered for this event with this email" },
        { status: 409 }
      );
    }
    throw err;
  }
}
