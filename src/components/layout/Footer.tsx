import Link from "next/link";
import Image from "next/image";
import Skyline from "@/components/home/Skyline";
import { Doodle, Stars } from "@/components/home/Vector";
import { EVENT } from "@/config/event";

const EXPLORE = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About the fest" },
];

const TAKE_PART = [
  { href: "/status", label: "Check status" },
  { href: "/admin", label: "Organizer sign in" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="relative h-[110px] bg-orange sm:h-[140px]">
        <Skyline id="footer-fort" className="absolute bottom-0 left-0 h-full w-full" fill="#2b1e14" fillTop="#2b1e14" />
        <Doodle kind="kite" size={64} className="float-y left-[8%] top-1 hidden sm:block" style={{ "--t": "9s" } as React.CSSProperties} />
        <Doodle kind="kite" size={48} className="float-y right-[12%] top-4 hidden sm:block" style={{ "--t": "11s", "--d": "-4s" } as React.CSSProperties} />
      </div>

      <div className="relative border-t-2 border-ink px-6 pb-12 pt-14 sm:px-10">
        <Stars count={48} className="opacity-70" />

        <div className="relative grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-white/80 bg-white/10 shadow-[4px_4px_0_#ff7a1a]">
                <Image src="/images/pragyam-logo.png" alt="" width={32} height={32} className="h-8 w-8" />
              </span>
              <div className="leading-none">
                <p className="font-display text-3xl">Pragyam</p>
                <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.28em] text-marigold">2.0 · Tech Fest · {EVENT.dateLabel}</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
              A student-run tech fest themed around AI. Propose an event, get it approved, and watch the department show up.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-marigold">Explore</p>
            <ul className="mt-4 space-y-3 text-sm font-semibold text-white/85">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-marigold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-marigold">Take part</p>
            <ul className="mt-4 space-y-3 text-sm font-semibold text-white/85">
              {TAKE_PART.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-marigold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-marigold">Where</p>
            <p className="mt-4 text-sm font-semibold text-white/85">{EVENT.org}</p>
            <p className="mt-1 text-sm text-white/60">{EVENT.uni}</p>
            <Doodle kind="chip" size={56} className="float-y relative mt-6 !static" style={{ "--t": "6s" } as React.CSSProperties} />
          </div>
        </div>

        <div className="relative mt-12 flex flex-col gap-2 border-t-2 border-dashed border-white/20 pt-6 text-[11px] uppercase tracking-[0.14em] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>Built by students · {EVENT.org}</p>
          <p>Imagine · Create · Participate</p>
        </div>
      </div>
    </footer>
  );
}
