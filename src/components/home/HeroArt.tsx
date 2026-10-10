import Link from "next/link";
import Image from "next/image";
import { EVENT } from "@/config/event";
import HeroParallax from "@/components/home/HeroParallax";
import { Waves } from "@/components/home/Decor";

type Depth = { px: number; py: number; sp: number };
const depth = (d: Depth) => ({ "--px": d.px, "--py": d.py, "--sp": d.sp }) as React.CSSProperties;
const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

/**
 * The aura behind the TV head — a god's halo: a glowing ring, a dashed and a dotted ring turning in
 * opposite directions, slow god-rays and a red glow, with the category chips and sparkles orbiting on
 * the rings. All of it sits BEHIND the character, so the chips pass behind the head and body.
 */
type Orbiter =
  | { kind: "chip"; label: string; tone: "orange" | "teal" | "pink" | "marigold"; r: number; a: number; t: number; rot: number; rev?: boolean }
  | { kind: "spark"; r: number; a: number; t: number; size: number; d: number; rev?: boolean }
  | { kind: "dot"; r: number; a: number; t: number; rev?: boolean };

// r is a radius in % of the stage width; a the starting angle in degrees; t one lap in seconds.
const ORBITERS: Orbiter[] = [
  { kind: "chip", label: "AI / ML", tone: "orange", r: 38, a: 200, t: 46, rot: -5 },
  { kind: "chip", label: "Hackathon", tone: "teal", r: 38, a: 20, t: 46, rot: 4 },
  { kind: "chip", label: "Gaming", tone: "pink", r: 47, a: 112, t: 64, rot: -4, rev: true },
  { kind: "chip", label: "Quiz", tone: "marigold", r: 47, a: 292, t: 64, rot: 5, rev: true },
  { kind: "spark", r: 31, a: 70, t: 30, size: 18, d: 0 },
  { kind: "spark", r: 31, a: 250, t: 30, size: 13, d: -1.2 },
  { kind: "spark", r: 38, a: 115, t: 46, size: 15, d: -0.6 },
  { kind: "spark", r: 47, a: 22, t: 64, size: 20, d: -2, rev: true },
  { kind: "spark", r: 57, a: 160, t: 84, size: 16, d: -0.9, rev: true },
  { kind: "spark", r: 57, a: 335, t: 84, size: 12, d: -1.6, rev: true },
  { kind: "dot", r: 31, a: 160, t: 30 },
  { kind: "dot", r: 38, a: 300, t: 46 },
  { kind: "dot", r: 47, a: 200, t: 64, rev: true },
  { kind: "dot", r: 57, a: 70, t: 84, rev: true },
];

function Aura() {
  return (
    <div className="hx-aura">
      <div className="hx-aura-glow" />
      <div className="hx-aura-rays" />
      <div className="hx-halo hx-halo-1" />
      <div className="hx-halo hx-halo-2" />
      <div className="hx-halo hx-halo-3" />
      <div className="hx-halo hx-halo-4" />
      {ORBITERS.map((o, i) => (
        <div
          key={i}
          className={`hx-orbiter ${o.rev ? "is-rev" : ""} ${o.kind === "chip" ? "max-sm:hidden" : ""}`}
          style={{ "--r": `${o.r}cqw`, "--a": `${o.a}deg`, "--t": `${o.t}s` } as React.CSSProperties}
        >
          <div className="hx-orbiter-body">
            {o.kind === "chip" ? (
              <span className={`hx-chip hx-chip-${o.tone}`} style={{ rotate: `${o.rot}deg` }}>
                {o.label}
              </span>
            ) : o.kind === "spark" ? (
              <span className="hx-spark twinkle" style={{ fontSize: o.size, "--d": `${o.d}s` } as React.CSSProperties}>
                ✦
              </span>
            ) : (
              <i className="hx-dotp" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

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
      {/* flat atmosphere: dot grid, a giant outlined watermark, and an edge caption */}
      <div className="hx-dots absolute inset-0" aria-hidden />
      <div className="hx-watermark font-display" aria-hidden>
        PRAGYAM
      </div>
      <p className="hx-vertical hidden lg:block" aria-hidden>
        Vol. 2.0 &nbsp;·&nbsp; CURAJ &nbsp;·&nbsp; {EVENT.dateShort}
      </p>

      <div className="hx-inner relative z-10 mx-auto grid w-full max-w-[1400px] items-center gap-8 px-6 pt-[10.5rem] sm:px-12 sm:pt-[11rem] lg:grid-cols-[1.05fr_0.95fr] lg:px-16 lg:pt-[12.5rem]">
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

          <p className="hero-in hx-tag hx-stickers mt-6" style={delay(0.28)} aria-label="Imagine. Create. Participate.">
            <span className="hx-sticker hx-sticker-white" aria-hidden>Imagine.</span>
            <span className="hx-sticker hx-sticker-red" aria-hidden>Create.</span>
            <span className="hx-sticker hx-sticker-outline" aria-hidden>Participate.</span>
          </p>

          <div className="hero-in mt-8 flex flex-wrap items-center gap-4" style={delay(0.48)}>
            <Link href="/events" className="btn btn-orange">
              Explore events
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="/host" className="btn btn-white">
              Host an event
            </Link>
          </div>

          <p className="hero-in hx-note mt-6" style={delay(0.58)}>
            No account needed · Host or take part
          </p>
        </div>

        {/* centrepiece */}
        <div className="hx-stage relative mx-auto w-full max-w-[560px]" aria-hidden>
          <div className="hero-layer" style={depth({ px: -26, py: -12, sp: 40 })}>
            <Aura />
          </div>
          <div className="hero-layer hx-figure-wrap" style={depth({ px: -30, py: -14, sp: 44 })}>
            <Image src="/images/hero-tv.webp" alt="" width={671} height={887} priority className="hx-figure" />
          </div>
        </div>
      </div>

      <Marquee />
      <div className="hx-blend" aria-hidden />
    </HeroParallax>
  );
}
