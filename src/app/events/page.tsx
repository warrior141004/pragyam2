"use client";

import { useEffect, useState, useCallback } from "react";
import EventCard from "@/components/events/EventCard";
import PageHeader from "@/components/shared/PageHeader";
import type { EventDTO } from "@/types";

export default function EventsPage() {
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    try {
      const res = await fetch(`/api/events?${params.toString()}`);
      if (!res.ok) {
        setError("Could not load events. Please try again.");
        setEvents([]);
        return;
      }
      const data = await res.json();
      setEvents(data.events || []);
    } catch {
      setError("Could not load events. Please try again.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      <PageHeader
        eyebrow="Participate"
        title={
          <>
            Approved <span className="font-display text-orange">events</span>
          </>
        }
        lede="Everything below has been reviewed by the organizers and is open for registration."
      />

      <div className="glass glass-sheen mt-10 flex rounded-md p-4">
        <label className="relative w-full">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/76"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
          >
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search events"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-glass !rounded-md !pl-11"
          />
        </label>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass h-64 animate-pulse rounded-md" />
            ))}
          </div>
        ) : error ? (
          <p className="alert-error">{error}</p>
        ) : events.length === 0 ? (
          <div className="glass glass-sheen rounded-md p-10 text-center">
            <p className="font-display text-xl font-semibold text-ink">Nothing here yet</p>
            <p className="mt-2 text-sm text-ink/76">
              No approved events match your search. Try another keyword or check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e, i) => (
              <EventCard key={e._id} event={e} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
