import type { CSSProperties } from "react";

const INK = "#0d0d0d";

type EdgeShape = "scallop" | "zigzag" | "wave";

/**
 * Decorative edge that sits at the top of a section and is filled with the
 * colour of the section ABOVE, so the previous section appears to bite into
 * this one with a vector-cut edge.
 */
export function SectionEdge({ shape, fill, className = "", height = 32 }: { shape: EdgeShape; fill: string; className?: string; height?: number }) {
  const W = 1440;
  let d = "";
  if (shape === "scallop") {
    // Walk right-to-left along the top edge with clockwise arcs so each
    // semicircle bulges downward into the section.
    const r = 24;
    d = `M0 0 H${W}`;
    for (let x = W; x > 0; x -= 2 * r) d += ` A${r} ${r} 0 0 1 ${x - 2 * r} 0`;
    d += " Z";
  } else if (shape === "zigzag") {
    d = "M0 0";
    for (let x = 0; x < W; x += 40) d += ` L${x + 20} 32 L${x + 40} 0`;
    d += " Z";
  } else {
    d = `M0 0 H${W} V10 C1200 34 960 -6 720 16 C480 38 240 -2 0 14 Z`;
  }
  return (
    <svg
      className={`pointer-events-none absolute inset-x-0 top-0 w-full ${className}`}
      style={{ height }}
      viewBox="0 0 1440 32"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d={d} fill={fill} />
    </svg>
  );
}

type DoodleKind = "gear" | "chip" | "satellite" | "dome" | "bolt" | "kite" | "cloud";

const stroke = { fill: "none", stroke: INK, strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Shape({ kind }: { kind: DoodleKind }) {
  switch (kind) {
    case "gear":
      return (
        <g>
          <path
            d="M32 6l4 6 7-2 2 7 7 2-2 7 6 4-6 4 2 7-7 2-2 7-7-2-4 6-4-6-7 2-2-7-7-2 2-7-6-4 6-4-2-7 7-2 2-7 7 2z"
            {...stroke}
            fill="#ffffff"
          />
          <circle cx="32" cy="32" r="9" {...stroke} fill="#fff" />
        </g>
      );
    case "chip":
      return (
        <g>
          <rect x="18" y="18" width="28" height="28" rx="4" {...stroke} fill="#ffffff" />
          <rect x="26" y="26" width="12" height="12" {...stroke} fill="#fff" />
          <path d="M24 18V9M32 18V9M40 18V9M24 46v9M32 46v9M40 46v9M18 24H9M18 32H9M18 40H9M46 24h9M46 32h9M46 40h9" {...stroke} />
        </g>
      );
    case "satellite":
      return (
        <g>
          <rect x="26" y="26" width="12" height="12" transform="rotate(45 32 32)" {...stroke} fill="#e23744" />
          <path d="M10 18l12 12M42 34l12 12" {...stroke} />
          <rect x="2" y="6" width="16" height="10" transform="rotate(45 10 11)" {...stroke} fill="#ffffff" />
          <rect x="46" y="48" width="16" height="10" transform="rotate(45 54 53)" {...stroke} fill="#ffffff" />
          <path d="M38 26c5-5 12-5 17 0" {...stroke} />
          <path d="M42 22c7-7 16-7 23 0" {...stroke} strokeOpacity="0.5" />
        </g>
      );
    case "dome":
      return (
        <g>
          <path d="M10 40a22 22 0 0 1 44 0z" {...stroke} fill="#d90429" />
          <rect x="6" y="40" width="52" height="8" {...stroke} fill="#fff" />
          <path d="M32 18v-9" {...stroke} />
          <circle cx="32" cy="7" r="3" {...stroke} fill="#e23744" />
          <path d="M14 48v10M50 48v10M22 48v10M42 48v10" {...stroke} />
        </g>
      );
    case "bolt":
      return <path d="M36 4L14 36h16l-4 24 24-34H34z" {...stroke} fill="#d90429" />;
    case "kite":
      return (
        <g>
          <path d="M32 4l20 22-20 30-20-30z" {...stroke} fill="#0d0d0d" />
          <path d="M32 4v52M12 26h40" {...stroke} stroke="#ffffff" strokeOpacity="0.55" strokeWidth={1.6} />
          <path d="M32 56q8 6-2 12" {...stroke} />
        </g>
      );
    default:
      return (
        <path
          d="M18 46a10 10 0 0 1 2-19 14 14 0 0 1 26-4 10 10 0 0 1 8 23z"
          {...stroke}
          fill="#fff"
        />
      );
  }
}

export function Doodle({
  kind,
  className = "",
  size = 64,
  style,
}: {
  kind: DoodleKind;
  className?: string;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg className={`doodle ${className}`} style={{ width: size, height: size, ...style }} viewBox="0 0 64 64" aria-hidden>
      <Shape kind={kind} />
    </svg>
  );
}

/** Deterministic star positions so SSR matches the client. */
const STAR_FIELD = (() => {
  let s = 99;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  return Array.from({ length: 120 }, () => ({ x: rnd() * 100, y: rnd() * 100, r: 0.8 + rnd() * 1.6, d: -rnd() * 3 }));
})();

/** Small star field for dark sections. */
export function Stars({ count = 40, className = "" }: { count?: number; className?: string }) {
  const stars = STAR_FIELD.slice(0, Math.min(count, STAR_FIELD.length));
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {stars.map((st, i) => (
        <circle
          key={i}
          className={i % 6 === 0 ? "twinkle" : undefined}
          style={i % 6 === 0 ? ({ "--d": `${st.d}s` } as CSSProperties) : undefined}
          cx={st.x}
          cy={st.y}
          r={st.r * 0.22}
          fill="#fff"
          fillOpacity={i % 3 === 0 ? 0.9 : 0.55}
        />
      ))}
    </svg>
  );
}
