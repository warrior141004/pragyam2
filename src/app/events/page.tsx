"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import EventCard, { EventCardSkeleton } from "@/components/events/EventCard";
import PageHeader from "@/components/shared/PageHeader";
import type { EventDTO } from "@/types";

export default function EventsPage() {
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  // Category filter runs on the loaded list in the browser; the search request is unchanged.
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of events) counts.set(e.category, (counts.get(e.category) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [events]);
  // A new search can remove the selected category entirely; fall back to "All" rather than an empty grid.
  const active = category && categories.some(([c]) => c === category) ? category : null;
  const shown = active ? events.filter((e) => e.category === active) : events;

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

      {!loading && !error && categories.length > 1 && (
        <div className="filter-row mt-6" role="group" aria-label="Filter by category">
          <button type="button" onClick={() => setCategory(null)} className={`chip ${active === null ? "chip-active" : ""}`} aria-pressed={active === null}>
            All <span className="chip-count">{events.length}</span>
          </button>
          {categories.map(([cat, n]) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(active === cat ? null : cat)}
              className={`chip ${active === cat ? "chip-active" : ""}`}
              aria-pressed={active === cat}
            >
              {cat} <span className="chip-count">{n}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="alert-error">{error}</p>
        ) : shown.length === 0 ? (
          <div className="glass-strong mx-auto max-w-lg rounded-md p-10 text-center">
            <p className="font-display text-2xl text-ink">Nothing here yet</p>
            <p className="mt-2 text-sm text-ink/70">
              {search ? "No approved events match your search. Try another keyword." : "No approved events yet — check back soon."}
            </p>
            <Link href="/host" className="btn btn-orange mt-6">
              Host the first one
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink/70" aria-live="polite">
              {shown.length} event{shown.length === 1 ? "" : "s"}
              {active ? ` in ${active}` : ""}
              {search ? ` matching “${search}”` : ""}
            </p>
            {/* key forces the stagger to replay when the filter changes */}
            <div key={active ?? "all"} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((e, i) => (
                <EventCard key={e._id} event={e} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
