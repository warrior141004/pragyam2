"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import RegisterForm from "@/components/events/RegisterForm";
import type { EventDTO } from "@/types";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [event, setEvent] = useState<EventDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setEvent(data.event);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-10 lg:grid-cols-5">
        <div className="glass h-96 animate-pulse rounded-md lg:col-span-3" />
        <div className="glass h-80 animate-pulse rounded-md lg:col-span-2" />
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="mx-auto max-w-xl px-4 pb-10">
        <div className="glass glass-sheen rounded-md p-10 text-center">
          <p className="font-display text-2xl font-bold text-ink">Event not found</p>
          <p className="mt-2 text-sm text-ink/76">It may have been removed or isn&apos;t approved yet.</p>
          <Link href="/events" className="btn btn-glass mt-6">
            Back to events
          </Link>
        </div>
      </div>
    );
  }

  const full = event.registrationsClosed || event.approvedCount >= event.maxParticipants;
  const pct = Math.min(100, Math.round((event.approvedCount / Math.max(event.maxParticipants, 1)) * 100));

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      <Link href="/events" className="chip animate-fade-up">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M13 8H3M7 4 3 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All events
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <article className="glass glass-sheen animate-fade-up rounded-md p-7 sm:p-10 lg:col-span-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="chip chip-active">{event.category}</span>
            <span className="text-sm text-ink/70">
              Hosted by <span className="text-ink/85">{event.proposerName}</span>
            </span>
            {event.proposerEmail && (
              <a href={`mailto:${event.proposerEmail}`} className="text-sm font-semibold text-orange underline underline-offset-4 break-all">
                {event.proposerEmail}
              </a>
            )}
          </div>

          <h1 className="font-display mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            {event.title}
          </h1>

          <p className="mt-7 whitespace-pre-wrap text-base leading-relaxed text-ink/72">{event.description}</p>

          {event.rules && (
            <>
              <div className="hairline my-8" />
              <h2 className="font-display text-lg font-semibold text-ink">
                Rules <span className="font-display text-ink/66">&amp; format</span>
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink/68">{event.rules}</p>
            </>
          )}
        </article>

        <aside className="animate-fade-up lg:col-span-2 lg:sticky lg:top-28 lg:self-start">
          <div className="glass-strong glass-sheen tint-violet rounded-md p-7">
            <dl className="grid grid-cols-2 gap-5">
              <Detail label="Date" value={event.preferredDate || "TBA"} />
              <Detail label="Time" value={event.preferredTime || "TBA"} />
              <Detail label="Venue" value={event.venue || event.venueRequirements || "TBA"} className="col-span-2" />
              {event.duration && <Detail label="Duration" value={event.duration} className="col-span-2" />}
            </dl>

            <div className="hairline my-6" />

            <div className="flex items-end justify-between">
              <p className="text-xs uppercase tracking-wider text-ink/66">Spots filled</p>
              <p className="font-display text-2xl font-bold text-ink">
                {event.approvedCount}
                <span className="text-base font-normal text-ink/76"> / {event.maxParticipants}</span>
              </p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-md bg-ink/5">
              <div
                className={`h-full rounded-md ${full ? "bg-ink/20" : "bg-gradient-to-r from-orange to-amber-400"}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="mt-7">
              {done ? (
                <div className="rounded-md border border-teal/40 bg-teal/10 p-5">
                  <p className="font-display text-lg font-semibold text-teal">You&apos;re registered</p>
                  <p className="mt-1.5 text-sm text-ink/70">
                    The host has been notified. Keep an eye on your inbox for details closer to the day.
                  </p>
                </div>
              ) : full ? (
                <button disabled className="btn btn-glass w-full">
                  Registration closed
                </button>
              ) : !showForm ? (
                <button onClick={() => setShowForm(true)} className="btn btn-primary w-full">
                  Register now
                </button>
              ) : (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold text-ink">Your details</h3>
                    <button onClick={() => setShowForm(false)} className="text-xs text-ink/70 hover:text-ink">
                      Cancel
                    </button>
                  </div>
                  <RegisterForm eventId={event._id} onDone={() => setDone(true)} />
                </div>
              )}
            </div>

            <div className="hairline my-6" />
            <Link href={`/manage/${event._id}`} className="block text-center text-sm font-semibold text-orange underline underline-offset-4">
              Hosting this event? Manage it
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Detail({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-[11px] uppercase tracking-wider text-ink/66">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}
