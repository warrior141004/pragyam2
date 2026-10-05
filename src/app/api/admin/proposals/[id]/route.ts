import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/server/db/connect";
import { isAdminRequest } from "@/server/auth/adminAuth";
import EventProposal from "@/server/models/EventProposal";
import { sendManageLinkEmail, sendProposalApprovedEmail, sendProposalRejectedEmail } from "@/server/mail/email";
import { newManageKey } from "@/server/auth/hostAuth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await req.json();
  const { action, rejectionReason, ...editFields } = body;

  const proposal = await EventProposal.findById(id);
  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  if (action === "approve") {
    proposal.status = "APPROVED";
    proposal.rejectionReason = "";
    // The host's manage key is issued here, on approval, and emailed with the approval notice.
    const { key, hash } = newManageKey();
    proposal.manageKeyHash = hash;
    await proposal.save();
    // Status is persisted first; email failure must not roll it back.
    await sendProposalApprovedEmail({
      to: proposal.proposerEmail,
      proposerName: proposal.proposerName,
      eventTitle: proposal.title,
      eventId: String(proposal._id),
      manageKey: key,
    });
  } else if (action === "resend-manage-link") {
    if (proposal.status !== "APPROVED") {
      return NextResponse.json({ error: "Only approved events have a manage link" }, { status: 400 });
    }
    // Issues a new key (the old link stops working) and emails it to the host.
    const { key, hash } = newManageKey();
    proposal.manageKeyHash = hash;
    await proposal.save();
    await sendManageLinkEmail({
      to: proposal.proposerEmail,
      hostName: proposal.proposerName,
      eventTitle: proposal.title,
      eventId: String(proposal._id),
      manageKey: key,
    });
  } else if (action === "reject") {
    proposal.status = "REJECTED";
    proposal.rejectionReason = rejectionReason || "";
    await proposal.save();
    await sendProposalRejectedEmail({
      to: proposal.proposerEmail,
      proposerName: proposal.proposerName,
      eventTitle: proposal.title,
      reason: rejectionReason,
    });
  } else {
    // Plain edit of an approved event's details
    const editable = [
      "venue",
      "maxParticipants",
      "preferredDate",
      "preferredTime",
      "duration",
      "registrationsClosed",
      "description",
    ];
    const p = proposal as unknown as Record<string, unknown>;
    for (const key of editable) {
      if (key in editFields) {
        p[key] = editFields[key];
      }
    }
    await proposal.save();
  }

  const { manageKeyHash: _omit, ...safe } = proposal.toObject();
  void _omit;
  return NextResponse.json({ ok: true, proposal: safe });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await EventProposal.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
