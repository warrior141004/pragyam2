import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { authorizeHost } from "@/server/auth/hostAuth";
import Registration from "@/server/models/Registration";

// DELETE: the host removes one participant, only from their own event.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; regId: string }> }
) {
  const { id, regId } = await params;
  const auth = await authorizeHost(req, id);
  if (auth.error) return auth.error;

  if (!mongoose.Types.ObjectId.isValid(regId)) {
    return NextResponse.json({ error: "Invalid registration" }, { status: 400 });
  }

  const res = await Registration.deleteOne({ _id: regId, event: id });
  if (res.deletedCount === 0) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
