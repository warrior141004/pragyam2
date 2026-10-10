import Link from "next/link";
import CategoryArt from "@/components/events/CategoryArt";
import type { EventDTO } from "@/types";

export default function EventCard({ event, index = 0 }: { event: EventDTO; index?: number }) {
  const full = event.registrationsClosed || event.approvedCount >= event.maxParticipants;
  const pct = Math.min(100, Math.round((event.approvedCount / Math.max(event.maxParticipants, 1)) * 100));
  const left = Math.max(0, event.maxParticipants - event.approvedCount);
  // "few seats" once 80% is taken, so the urgency means something
  const few = !full && pct >= 80;

  return (
    <Link
      href={`/events/${event._id}`}
      className="event-card card-in glass-strong group flex flex-col overflow-hidden rounded-md"
      style={{ "--i": index } as React.CSSProperties}
    >
      <div className="relative">
        <CategoryArt category={event.category} seed={event._id} title={event.title} description={event.description} className="h-44" />
        <span className={`card-status ${full ? "card-status-full" : few ? "card-status-few" : "card-status-open"}`}>
          {!full && !few && <i className="dot" />}
          {full ? (event.registrationsClosed ? "Closed" : "Full") : few ? "Few seats left" : "Open"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-orange">{event.category}</p>
        <h3 className="font-display mt-2 text-2xl leading-[1.05] text-ink">{event.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/70">{event.description}</p>

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 text-xs">
            <span className="truncate text-ink/70">
              Hosted by <span className="font-semibold text-ink">{event.proposerName}</span>
            </span>
            <span className="shrink-0 font-bold text-ink tabular-nums">
              {full ? `${event.approvedCount} / ${event.maxParticipants}` : `${left} seat${left === 1 ? "" : "s"} left`}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-sm bg-ink/10">
            <div className={`h-full ${full ? "bg-ink/30" : "bg-orange"}`} style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink">
              {full ? "View details" : "Register"}
            </span>
            <span className="card-go flex h-9 w-9 items-center justify-center rounded-md bg-ink text-cream">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/** Same shape as the card, so nothing jumps when the real ones arrive. */
export function EventCardSkeleton() {
  return (
    <div className="glass-strong flex flex-col overflow-hidden rounded-md" aria-hidden>
      <div className="skeleton h-44 !rounded-none" />
      <div className="flex flex-col gap-3 p-5">
        <div className="skeleton h-3 w-20" />
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-5/6" />
        <div className="skeleton mt-4 h-1.5 w-full" />
        <div className="mt-2 flex items-center justify-between">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-9 w-9" />
        </div>
      </div>
    </div>
  );
}
