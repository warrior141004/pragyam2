import type { EventDTO } from "@/types";

const TTL = 60_000;
let cached: { at: number; promise: Promise<EventDTO[]> } | null = null;

/** One shared request for approved events per minute, so widgets on the same page don't each hit the API. */
export function fetchApprovedEvents(): Promise<EventDTO[]> {
  const now = Date.now();
  if (cached && now - cached.at < TTL) return cached.promise;
  const promise = fetch("/api/events")
    .then((r) => (r.ok ? r.json() : { events: [] }))
    .then((d) => (d.events || []) as EventDTO[])
    .catch(() => {
      cached = null;
      return [] as EventDTO[];
    });
  cached = { at: now, promise };
  return promise;
}
