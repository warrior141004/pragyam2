import { NextResponse } from "next/server";
import { connectDB } from "@/server/db/connect";
import { isAdminRequest } from "@/server/auth/adminAuth";
import EventProposal from "@/server/models/EventProposal";
import Registration from "@/server/models/Registration";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();

  const [pendingProposals, approvedEvents, totalEvents, totalRegistrations] =
    await Promise.all([
      EventProposal.countDocuments({ status: "PENDING" }),
      EventProposal.countDocuments({ status: "APPROVED" }),
      EventProposal.countDocuments({}),
      Registration.countDocuments({}),
    ]);

  return NextResponse.json({
    pendingProposals,
    approvedEvents,
    totalEvents,
    totalRegistrations,
  });
}
