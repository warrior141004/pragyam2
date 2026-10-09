import Link from "next/link";
import Image from "next/image";
import { EVENT } from "@/config/event";
import HeroParallax from "@/components/home/HeroParallax";
import { Waves } from "@/components/home/Decor";

type Depth = { px: number; py: number; sp: number };
const depth = (d: Depth) => ({ "--px": d.px, "--py": d.py, "--sp": d.sp }) as React.CSSProperties;
const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;
const float = (t: number, d = 0) => ({ "--t": `${t}s`, "--d": `${d}s` }) as React.CSSProperties;

// Positions are relative to the stage column, so they can never collide with the copy.
const CHIPS = [
  { label: "AI / ML", x: "-2%", y: "16%", rot: -6, tone: "orange", t: 7, d: 0 },
  { label: "Hackathon", x: "66%", y: "6%", rot: 5, tone: "teal", t: 9, d: -3 },
  { label: "Gaming", x: "72%", y: "74%", rot: -4, tone: "pink", t: 8, d: -5 },
  { label: "Quiz", x: "-4%", y: "76%", rot: 6, tone: "marigold", t: 10, d: -2 },
];

const TRACKS = ["Technical", "Gaming", "Creative", "Cultural", "Quiz", "Competition", "Fun Activity"];

function Marquee() {
  // The list is doubled so the loop is seamless when it travels -50%.
  const items = [...TRACKS, ...TRACKS, ...TRACKS, ...TRACKS];
  return (
    <div className="hx-marquee" aria-hidden>
      <div className="hx-marquee-track">
        {items.map((t, i) => (
          <span key={i} className="font-display">
            {t}
            <b>✦</b>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HeroArt() {
  return (
    <HeroParallax className="hx relative overflow-hidden">
      {/* flat atmosphere: dot grid and doodles */}
      <div className="hx-dots absolute inset-0" aria-hidden />

      <div className="hx-inner relative z-10 mx-auto grid w-full max-w-[1400px] items-center gap-8 px-6 pt-[8.5rem] sm:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-16 lg:pt-[9rem]">
        {/* copy */}
        <div className="hero-copy" style={depth({ px: 8, py: 5, sp: -60 })}>
          <div className="hero-in flex flex-wrap items-center gap-3" style={delay(0.05)}>
            <span className="hx-badge">
              <i className="hx-dot" />
              {EVENT.org} · CURAJ
            </span>
            <span className="hx-soon">{EVENT.dateLabel}</span>
          </div>

          <h1 className="hero-in hx-title font-display mt-6" style={delay(0.15)}>
            Pragyam
            <span className="hx-ver">2.0</span>
          </h1>

          <Waves className="hero-in mt-4 h-3 w-28 text-orange" />

          <p className="hero-in hx-tag mt-5" style={delay(0.28)}>
            <span>Imagine.</span> <span className="t-gold">Create.</span> <span className="t-teal">Participate.</span>
          </p>

          <div className="hero-in mt-8 flex flex-wrap items-center gap-4" style={delay(0.48)}>
            <Link href="/events" className="btn btn-primary">
              Explore events
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="/host" className="btn btn-orange">
              Host an event
            </Link>
          </div>

          <p className="hero-in hx-note mt-6" style={delay(0.58)}>
            No account needed · Host or take part
          </p>
        </div>

        {/* centrepiece */}
        <div className="hx-stage relative mx-auto w-full max-w-[560px]" aria-hidden>
          <div className="hero-layer" style={depth({ px: -14, py: -8, sp: 30 })}>
            <div className="hx-disc" />
            <div className="hx-orbit spin-slow" style={{ "--t": "50s" } as React.CSSProperties} />
          </div>
          <div className="hero-layer hx-figure-wrap" style={depth({ px: -30, py: -14, sp: 44 })}>
            <Image src="/images/hero-figure.webp" alt="" width={736} height={920} priority className="hx-figure" />
          </div>
          <div className="hero-layer hidden sm:block" style={depth({ px: -44, py: -28, sp: 20 })}>
            {CHIPS.map((c) => (
              <span
                key={c.label}
                className={`hx-chip hx-chip-${c.tone} float-y`}
                style={{ left: c.x, top: c.y, rotate: `${c.rot}deg`, ...float(c.t, c.d) }}
              >
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Marquee />
    </HeroParallax>
  );
}
