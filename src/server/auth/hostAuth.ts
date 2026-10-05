import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/server/db/connect";
import EventProposal from "@/server/models/EventProposal";

export const HOST_KEY_HEADER = "x-manage-key";

const hashKey = (key: string) => createHash("sha256").update(key).digest("hex");

/** A fresh manage key. Only the hash is stored; the plain key exists solely in the host's email. */
export function newManageKey() {
  const key = randomBytes(24).toString("hex");
  return { key, hash: hashKey(key) };
}

function keyMatches(key: string, storedHash: string) {
  if (!key || !storedHash) return false;
  const a = Buffer.from(hashKey(key), "hex");
  const b = Buffer.from(storedHash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Loads an event only if the request carries that event's manage key.
 * Missing event and wrong key give the same 401, so ids can't be probed.
 */
export async function authorizeHost(req: NextRequest, id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { error: NextResponse.json({ error: "Invalid event" }, { status: 400 }) };
  }
  await connectDB();
  const key = req.headers.get(HOST_KEY_HEADER) ?? "";
  const event = await EventProposal.findById(id).select("+manageKeyHash");
  if (!event || !keyMatches(key, event.manageKeyHash)) {
    return { error: NextResponse.json({ error: "Invalid or missing manage link" }, { status: 401 }) };
  }
  return { event };
}
