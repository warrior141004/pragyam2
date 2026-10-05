import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/server/db/connect";
import EventProposal from "@/server/models/EventProposal";
import Registration from "@/server/models/Registration";
import { sendNewRegistrationEmailToHost, sendRegistrationConfirmationEmail } from "@/server/mail/email";
import { validateAnswers } from "@/server/registration/validate";
import { ENROLLMENT_RE, YEARS, type RegistrationQuestion } from "@/config/registration";

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });
const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(req: NextRequest) {
  await connectDB();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid request body");
  }

  const required = ["eventId", "participantName", "participantEmail", "participantPhone", "enrollmentNo", "department", "year"];
  for (const field of required) {
    if (!body[field]) return bad(`Missing required field: ${field}`);
  }

  if (!mongoose.Types.ObjectId.isValid(String(body.eventId))) return bad("Invalid event");

  const participantName = clean(body.participantName, 120);
  const participantEmail = clean(body.participantEmail, 200).toLowerCase();
  const participantPhone = clean(body.participantPhone, 30);
  const enrollmentNo = clean(body.enrollmentNo, 30).toUpperCase();
  const department = clean(body.department, 120);
  const year = clean(body.year, 30);
  const additionalNote = clean(body.additionalNote, 1000);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(participantEmail)) return bad("Invalid email address");
  if (!/^[0-9+\-\s()]{7,20}$/.test(participantPhone)) return bad("Invalid phone number");
  if (!ENROLLMENT_RE.test(enrollmentNo)) return bad("Invalid enrollment number");
  if (!(YEARS as readonly string[]).includes(year)) return bad("Invalid year");
  if (!participantName || !department) return bad("Name and department are required");

  const event = await EventProposal.findById(String(body.eventId));
  if (!event || event.status !== "APPROVED") return bad("This event is not open for registration");
  if (event.registrationsClosed) return bad("Registrations for this event are closed");

  // Team rules come from the host's settings. Team size counts the registrant.
  const minSize = Math.max(1, event.teamMinSize ?? 1);
  const maxSize = Math.max(minSize, event.teamMaxSize ?? 1);
  const teamEvent = maxSize > 1;
  const teamRequired = teamEvent && (minSize > 1 || Boolean(body.teamRequired));

  let teamMembers: { name: string; enrollmentNo: string }[] = [];
  let teamName = "";
  if (teamRequired) {
    const rawMembers = Array.isArray(body.teamMembers) ? body.teamMembers : [];
    teamMembers = rawMembers.map((m: { name?: unknown; enrollmentNo?: unknown }) => ({
      name: clean(m?.name, 120),
      enrollmentNo: clean(m?.enrollmentNo, 30).toUpperCase(),
    }));
    const size = teamMembers.length + 1;
    if (size < Math.max(minSize, 2) || size > maxSize) {
      return bad(`Team size must be between ${Math.max(minSize, 2)} and ${maxSize} (including you)`);
    }
    if (teamMembers.some((m) => !m.name || !ENROLLMENT_RE.test(m.enrollmentNo))) {
      return bad("Every team member needs a name and a valid enrollment number");
    }
    const all = [enrollmentNo, ...teamMembers.map((m) => m.enrollmentNo)];
    if (new Set(all).size !== all.length) return bad("Team members must have different enrollment numbers");
    teamName = clean(body.teamName, 100);
    if (!teamName) return bad("Please enter a team name");
  }

  const questions = (event.registrationQuestions ?? []) as RegistrationQuestion[];
  const checked = validateAnswers(questions, body.answers);
  if (checked.error) return bad(checked.error);
  const answers = checked.value ?? [];

  const currentCount = await Registration.countDocuments({ event: event._id });
  if (currentCount >= event.maxParticipants) return bad("This event has reached its maximum participant limit");

  try {
    const registration = await Registration.create({
      event: event._id,
      participantName,
      participantEmail,
      participantPhone,
      enrollmentNo,
      department,
      year,
      teamName,
      answers,
      teamRequired,
      teamMembers,
      additionalNote,
    });

    // Registration is already saved; email helpers never throw, so a mail failure can't undo it.
    const details = [
      { label: "Enrollment no.", value: enrollmentNo },
      { label: "Department / Course", value: department },
      { label: "Year", value: year },
      ...(teamName ? [{ label: "Team name", value: teamName }] : []),
      ...answers.map((a) => ({ label: a.label, value: a.value })),
    ];
    await Promise.all([
      sendNewRegistrationEmailToHost({
        to: event.proposerEmail,
        hostName: event.proposerName,
        eventTitle: event.title,
        participantName,
        participantEmail,
        participantPhone,
        teamMembers,
        additionalNote,
        details,
        registeredCount: currentCount + 1,
        maxParticipants: event.maxParticipants,
      }),
      sendRegistrationConfirmationEmail({
        to: participantEmail,
        participantName,
        eventTitle: event.title,
        eventId: String(event._id),
        details,
      }),
    ]);

    return NextResponse.json({ id: String(registration._id) }, { status: 201 });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return bad("You have already registered for this event with this email or enrollment number", 409);
    }
    throw err;
  }
}

