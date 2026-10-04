import Link from "next/link";
import Image from "next/image";
import { EVENT } from "@/config/event";
import HeroParallax from "@/components/home/HeroParallax";

type Depth = { px: number; py: number; sp: number };
const depth = (d: Depth) => ({ "--px": d.px, "--py": d.py, "--sp": d.sp }) as React.CSSProperties;
const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

// Positions are relative to the visor column, so they can never collide with the copy.
const CHIPS = [
  { label: "AI / ML", x: "4%", y: "14%", t: 7, d: 0 },
  { label: "Hackathon", x: "62%", y: "6%", t: 9, d: -3 },
  { label: "Gaming", x: "70%", y: "78%", t: 8, d: -5 },
  { label: "Quiz", x: "6%", y: "80%", t: 10, d: -2 },
];

/** Neon "visor" centrepiece: white-hot core, orange bloom, orbiting HUD rings. */
function Visor({ bar = true }: { bar?: boolean }) {
  return (
    <svg className="h-full w-full" viewBox="0 0 800 800" fill="none" aria-hidden>
      <defs>
        <radialGradient id="hx-glow" cx="50%" cy="46%" r="50%">
          <stop offset="0" stopColor="#ff6a1a" stopOpacity="0.85" />
          <stop offset="0.45" stopColor="#d92b0a" stopOpacity="0.35" />
          <stop offset="1" stopColor="#7a0c00" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hx-bar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ff5a1f" />
          <stop offset="0.5" stopColor="#fff3e0" />
          <stop offset="1" stopColor="#ff7a1a" />
        </linearGradient>
        <linearGradient id="hx-slab" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff8a2a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#7a0c00" stopOpacity="0.05" />
        </linearGradient>
        <filter id="hx-blur" x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <filter id="hx-blur-s" x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <circle cx="400" cy="380" r="380" fill="url(#hx-glow)" />

      {bar && (
        <>
      {/* angular holo slab behind the visor */}
      <path d="M150 640 L330 300 L690 250 L720 640 Z" fill="url(#hx-slab)" stroke="#ff9a4a" strokeOpacity="0.35" />

        </>
      )}

      <g className="hx-ring" style={{ transformOrigin: "400px 380px" }}>
        <circle cx="400" cy="380" r="290" stroke="#ff9a4a" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="4 12" />
        <circle cx="400" cy="380" r="340" stroke="#fff" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="80 24 6 24" />
      </g>
      <g className="hx-ring hx-ring-rev" style={{ transformOrigin: "400px 380px" }}>
        <circle cx="400" cy="380" r="240" stroke="#ff5a1f" strokeOpacity="0.7" strokeWidth="2" strokeDasharray="30 18" />
        <circle cx="400" cy="140" r="6" fill="#fff3e0" />
        <circle cx="640" cy="380" r="4" fill="#ff9a4a" />
      </g>

      {bar && (
        <>
      {/* the visor: bloom, body, hot core */}
      <g transform="rotate(-14 400 380)">
        <rect x="120" y="330" width="560" height="90" rx="45" fill="#ff4a0a" filter="url(#hx-blur)" opacity="0.95" />
        <rect x="120" y="340" width="560" height="70" rx="35" fill="url(#hx-bar)" filter="url(#hx-blur-s)" opacity="0.9" />
        <rect className="hx-pulse" x="128" y="348" width="544" height="54" rx="27" fill="url(#hx-bar)" />
        <rect x="170" y="358" width="440" height="10" rx="5" fill="#fff" fillOpacity="0.85" />
      </g>

        </>
      )}

      {/* HUD ticks */}
      <g stroke="#ffb27a" strokeOpacity="0.5" strokeWidth="1.5">
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const r1 = 372;
          const r2 = i % 6 === 0 ? 350 : 360;
          return <line key={i} x1={400 + Math.cos(a) * r1} y1={380 + Math.sin(a) * r1} x2={400 + Math.cos(a) * r2} y2={380 + Math.sin(a) * r2} />;
        })}
      </g>
    </svg>
  );
}

export default function HeroArt() {
  return (
    <div className="px-3 pb-3 sm:px-4">
      <HeroParallax className="hx relative overflow-hidden rounded-[28px]">
        {/* atmosphere */}
        <div className="hx-bg absolute inset-0" aria-hidden />
        <div className="hx-grid absolute inset-0" aria-hidden />
        <div className="hx-lines absolute inset-0" aria-hidden>
          <i /><i /><i /><i />
        </div>
        <div className="hx-noise absolute inset-0" aria-hidden />

        <div className="hx-inner relative z-10 mx-auto grid w-full max-w-[1400px] items-center gap-6 px-6 pb-20 pt-14 sm:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-16 lg:pb-24 lg:pt-16">
          {/* copy */}
          <div className="hero-copy hx-copy" style={depth({ px: 8, py: 5, sp: -60 })}>
            <p className="hero-in hx-badge" style={delay(0.05)}>
              <i className="hx-dot" />
              {EVENT.org} · CURAJ
            </p>

            <h1 className="hero-in hx-title font-display mt-6" style={delay(0.15)}>
              Pragyam
              <span className="hx-ver">2.0</span>
            </h1>

            <p className="hero-in hx-tag mt-4" style={delay(0.28)}>
              Imagine. Create. <em>Participate.</em>
            </p>

            <p className="hero-in hx-lead mt-5 max-w-md" style={delay(0.38)}>
              The student-run tech fest of {EVENT.uni}. Hackathons, games, quizzes and builds — pitch your own or jump into one.
            </p>

            <div className="hero-in mt-8 flex flex-wrap items-center gap-3 sm:gap-4" style={delay(0.48)}>
              <Link href="/events" className="hx-cta">
                <span>Explore events</span>
                <b aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </b>
              </Link>
              <Link href="/host" className="hx-ghostbtn">
                Host an event
              </Link>
            </div>
          </div>

          {/* centrepiece */}
          <div className="hx-stage relative mx-auto w-full max-w-[560px]" aria-hidden>
            <div className="hero-layer" style={depth({ px: -14, py: -8, sp: 30 })}>
              <Visor bar={false} />
            </div>
            <div className="hx-glowbed" />
            <div className="hero-layer hx-figure-wrap" style={depth({ px: -30, py: -14, sp: 44 })}>
              <Image src="/images/hero-figure.webp" alt="" width={736} height={920} priority className="hx-figure" />
            </div>
            <div className="hero-layer hidden sm:block" style={depth({ px: -44, py: -28, sp: 20 })}>
              {CHIPS.map((c) => (
                <span key={c.label} className="hx-chip float-y" style={{ left: c.x, top: c.y, "--t": `${c.t}s`, "--d": `${c.d}s` } as React.CSSProperties}>
                  <i /> {c.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* footer strip */}
        <div className="hx-foot absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 px-6 pb-5 sm:px-12 lg:px-16" aria-hidden>
          <span className="truncate">{EVENT.tagline}</span>
          <span className="flex shrink-0 items-center gap-2">
            Scroll <i className="hx-scroll" />
          </span>
        </div>
      </HeroParallax>
    </div>
  );
}
