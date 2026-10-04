import type { ReactNode } from "react";

export function Waves({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 12" preserveAspectRatio="none" fill="none" aria-hidden>
      <path
        d="M0 6c6.7-6 13.3-6 20 0s13.3 6 20 0 13.3-6 20 0 13.3 6 20 0 13.3-6 20 0 13.3 6 20 0 13.3-6 20 0 13.3 6 20 0"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WaveRule({ icon }: { icon?: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <Waves className="h-4 w-full max-w-[220px] text-orange" />
      {icon && <span className="shrink-0 text-orange">{icon}</span>}
      <Waves className="h-4 w-full max-w-[220px] text-orange" />
    </div>
  );
}

export function SectionTitle({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "orange" }) {
  const color = tone === "teal" ? "text-teal" : "text-orange";
  return (
    <div className="flex items-center justify-center gap-5">
      <Waves className={`hidden h-3 w-28 sm:block ${color}`} />
      <h2 className="font-display text-center text-3xl text-ink sm:text-4xl">{children}</h2>
      <Waves className={`hidden h-3 w-28 sm:block ${color}`} />
    </div>
  );
}

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const FIGURES = (() => {
  const rnd = lcg(20261027);
  const out: { x: number; scale: number; pose: number; flip: boolean }[] = [];
  let x = 80;
  while (x < 1400) {
    out.push({ x, scale: 0.85 + rnd() * 0.35, pose: Math.floor(rnd() * 4), flip: rnd() > 0.5 });
    x += 95 + rnd() * 90;
  }
  return out;
})();

function ground(x: number) {
  return 168 + Math.sin(x / 260) * 14 + Math.cos(x / 130) * 6;
}

function Figure({ x, scale, pose, flip }: { x: number; scale: number; pose: number; flip: boolean }) {
  const y = ground(x);
  const arms =
    pose === 0
      ? "M-10 -46 L-22 -74 M10 -46 L22 -74"
      : pose === 1
        ? "M-10 -46 L-26 -30 M10 -46 L26 -66 L26 -108"
        : pose === 2
          ? "M-10 -46 L-24 -22 M10 -46 L24 -22"
          : "M-10 -46 L-20 -70 M10 -46 L14 -18";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`} fill="#3a2213" stroke="#3a2213">
      <circle cx="0" cy="-62" r="9" stroke="none" />
      <path d="M-11 -50 h22 l4 30 h-30 z" stroke="none" />
      <path d="M-9 -20 L-14 8 M9 -20 L14 8" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d={arms} strokeWidth="6" strokeLinecap="round" fill="none" />
      {pose === 1 && <path d="M26 -108 l22 8 l-22 8 z" stroke="none" fill="#f28c28" />}
    </g>
  );
}

export function Silhouettes() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#f7e2c4] via-[#f6d9b2] to-[#f0caa0]">
      <svg viewBox="0 0 1440 220" className="block h-40 w-full sm:h-56" preserveAspectRatio="none" aria-hidden>
        <path
          d="M0 178 C 220 150, 420 205, 640 172 S 1060 148, 1240 176 S 1400 168, 1440 170 L1440 220 L0 220 Z"
          fill="#3a2213"
        />
        {FIGURES.map((f) => (
          <Figure key={f.x} {...f} />
        ))}
      </svg>
    </div>
  );
}
