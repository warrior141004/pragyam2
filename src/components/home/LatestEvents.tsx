"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EventCard, { EventCardSkeleton } from "@/components/events/EventCard";
import { fetchApprovedEvents } from "@/lib/eventsClient";
import type { EventDTO } from "@/types";

export default function LatestEvents() {
  const [events, setEvents] = useState<EventDTO[] | null>(null);

  useEffect(() => {
    fetchApprovedEvents().then((list) => setEvents(list.slice(0, 3)));
  }, []);

  if (events === null) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <EventCardSkeleton key={i} />
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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((e, i) => (
        <EventCard key={e._id} event={e} index={i} />
      ))}
    </div>
  );
}
