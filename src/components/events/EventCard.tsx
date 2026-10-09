import Link from "next/link";
import CategoryArt from "@/components/events/CategoryArt";
import type { EventDTO } from "@/types";

export default function EventCard({ event }: { event: EventDTO; index?: number }) {
  const full = event.registrationsClosed || event.approvedCount >= event.maxParticipants;
  const pct = Math.min(100, Math.round((event.approvedCount / Math.max(event.maxParticipants, 1)) * 100));

  return (
    <Link
      href={`/events/${event._id}`}
      className="glass-strong group flex flex-col overflow-hidden rounded-md transition-transform duration-300 hover:-translate-y-1.5"
    >
      <CategoryArt category={event.category} seed={event._id} title={event.title} description={event.description} className="h-40" />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange">{event.category}</p>
          <span className={`flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] ${full ? "text-ink/70" : "text-teal"}`}>
            <i className={`dot bg-current ${full ? "" : "animate-pulse"}`} />
            {full ? "Full" : "Open"}
          </span>
        </div>
        <h3 className="font-display mt-3 text-2xl leading-tight text-ink">{event.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/70">{event.description}</p>

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 text-xs">
            <span className="text-ink/70">
              Hosted by <span className="font-semibold text-ink">{event.proposerName}</span>
            </span>
            <span className="font-bold text-ink">
              {event.approvedCount}
              <span className="text-ink/70"> / {event.maxParticipants}</span>
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-sm bg-ink/10">
            <div className={`h-full ${full ? "bg-ink/30" : "bg-orange"}`} style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink">
              {full ? "Registration closed" : "Register"}
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink text-white transition-transform group-hover:translate-x-1">
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
