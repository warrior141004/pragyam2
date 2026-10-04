const PALETTE: Record<string, [string, string]> = {
  Technical: ["#4d1a78", "#ff3d8e"],
  Gaming: ["#150c3f", "#3ee0ff"],
  Creative: ["#ff7a1a", "#ffc632"],
  Cultural: ["#f28c28", "#ff3d8e"],
  Quiz: ["#3fb99a", "#ffc632"],
  Competition: ["#d63a6a", "#ffc632"],
  "Fun Activity": ["#2ec27e", "#3ee0ff"],
  Other: ["#3a2213", "#f28c28"],
};

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export default function CategoryArt({ category, seed, className = "" }: { category: string; seed: string; className?: string }) {
  const [c1, c2] = PALETTE[category] ?? PALETTE.Other;
  const rnd = lcg(hash(seed));
  const nodes = Array.from({ length: 8 }, () => ({ x: 8 + rnd() * 84, y: 12 + rnd() * 76, r: 1.8 + rnd() * 2.4 }));
  const links: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (rnd() > 0.7) links.push([i, j]);
    }
  }

  return (
    <div className={`relative overflow-hidden border-b-2 border-ink ${className}`} style={{ background: c1 }}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <circle cx="78" cy="28" r="34" fill={c2} />
        <circle cx="78" cy="28" r="22" fill={c1} />
        <circle cx="78" cy="28" r="10" fill={c2} />
        <path d="M0 78 Q25 66 50 78 T100 78 V100 H0 Z" fill="#2b1e14" fillOpacity="0.28" />
        {links.map(([a, b], i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="#fff" strokeOpacity="0.5" strokeWidth="0.5" />
        ))}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r} fill="#fff" stroke="#2b1e14" strokeWidth="0.6" />
        ))}
      </svg>
      <span className="font-display pointer-events-none absolute -bottom-5 left-3 text-[6rem] leading-none text-white/20">
        {category.charAt(0)}
      </span>
    </div>
  );
}
