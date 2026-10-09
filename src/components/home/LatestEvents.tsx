"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CategoryArt from "@/components/events/CategoryArt";
import { fetchApprovedEvents } from "@/lib/eventsClient";
import type { EventDTO } from "@/types";

export default function LatestEvents() {
  const [events, setEvents] = useState<EventDTO[] | null>(null);

  useEffect(() => {
    fetchApprovedEvents().then((list) => setEvents(list.slice(0, 3)));
  }, []);

  if (events === null) {
    return (
      <div className="grid gap-6 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="glass h-72 animate-pulse rounded-md" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="glass-strong mx-auto max-w-lg rounded-md p-8 text-center">
        <p className="font-display text-2xl text-ink">No events announced yet</p>
        <p className="mt-2 text-sm text-ink/70">Approved events will show up here. Have an idea? Be the first to host one.</p>
        <Link href="/host" className="btn btn-orange mt-6">
          Propose an event
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {events.map((e) => (
        <Link
          key={e._id}
          href={`/events/${e._id}`}
          className="glass-strong group flex flex-col overflow-hidden rounded-md transition-transform hover:-translate-y-1.5"
        >
          <CategoryArt category={e.category} seed={e._id} title={e.title} description={e.description} className="h-40" />
          <div className="p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange">{e.category}</p>
            <h3 className="font-display mt-2 text-xl leading-tight text-ink">{e.title}</h3>
            <p className="mt-2 text-xs text-ink/65">
              Hosted by {e.proposerName} · {e.approvedCount}/{e.maxParticipants} registered
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
