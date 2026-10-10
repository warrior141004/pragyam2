const MARIGOLD = "#ffffff";
const LIGHT_COLORS = [MARIGOLD, "#d90429", "#ffffff", "#ffffff", "#e23744"];

/** Jaipur-style skyline: battlements, towers with chhatris, a tiered haveli with arch windows. */
const SKYLINE = (() => {
  const parts: string[] = [];
  const windows: { x: number; y: number; w: number; h: number }[] = [];
  const domes: { cx: number; y: number; r: number }[] = [];

  parts.push("M0 200 V150 H1440 V200 Z");
  for (let x = 8; x < 1440; x += 34) parts.push(`M${x} 150 V136 H${x + 16} V150 Z`);

  const tower = (x: number, w: number, top: number) => {
    parts.push(`M${x} 200 V${top} H${x + w} V200 Z`);
    for (let mx = x + 4; mx < x + w - 6; mx += 14) parts.push(`M${mx} ${top} V${top - 9} H${mx + 7} V${top} Z`);
    domes.push({ cx: x + w / 2, y: top - 9, r: w * 0.32 });
    windows.push({ x: x + w / 2 - 6, y: top + 22, w: 12, h: 22 });
  };
  tower(70, 64, 92);
  tower(1306, 64, 92);
  tower(360, 44, 118);
  tower(1036, 44, 118);

  const tier = (x: number, w: number, top: number, cols: number) => {
    parts.push(`M${x} 200 V${top} H${x + w} V200 Z`);
    for (let mx = x + 6; mx < x + w - 8; mx += 18) parts.push(`M${mx} ${top} V${top - 8} H${mx + 8} V${top} Z`);
    const gap = w / cols;
    for (let c = 0; c < cols; c++) windows.push({ x: x + gap * c + gap / 2 - 7, y: top + 16, w: 14, h: 26 });
  };
  tier(520, 400, 112, 11);
  tier(586, 268, 78, 7);
  tier(656, 128, 46, 3);
  domes.push({ cx: 720, y: 38, r: 30 }, { cx: 604, y: 70, r: 16 }, { cx: 836, y: 70, r: 16 });

  const lights: number[] = [];
  for (let x = 24; x < 1440; x += 34) lights.push(x);

  return { body: parts.join(" "), windows, domes, lights };
})();

export default function Skyline({
  className = "",
  fill = "#0d0d0d",
  fillTop = "#1f1f1f",
  lights = true,
  id = "fort",
}: {
  className?: string;
  fill?: string;
  fillTop?: string;
  lights?: boolean;
  id?: string;
}) {
  return (
    <svg className={`pointer-events-none ${className}`} viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={fillTop} />
          <stop offset="1" stopColor={fill} />
        </linearGradient>
      </defs>
      {SKYLINE.domes.map((d, i) => (
        <g key={i}>
          <path d={`M${d.cx - d.r} ${d.y} A${d.r} ${d.r} 0 0 1 ${d.cx + d.r} ${d.y} Z`} fill={`url(#${id})`} />
          <rect x={d.cx - d.r - 3} y={d.y - 2} width={d.r * 2 + 6} height="5" fill={fill} />
          <path d={`M${d.cx} ${d.y - d.r} v-12`} stroke={fill} strokeWidth="3" strokeLinecap="round" />
          <circle cx={d.cx} cy={d.y - d.r - 15} r="3.5" fill={MARIGOLD} />
        </g>
      ))}
      <path d={SKYLINE.body} fill={`url(#${id})`} />
      {SKYLINE.windows.map((w, i) => (
        <path
          key={i}
          d={`M${w.x} ${w.y + w.h} V${w.y + 6} Q${w.x} ${w.y} ${w.x + w.w / 2} ${w.y - 3} Q${w.x + w.w} ${w.y} ${w.x + w.w} ${w.y + 6} V${w.y + w.h} Z`}
          fill={MARIGOLD}
          fillOpacity="0.9"
        />
      ))}
      {lights && (
        <>
          <path d="M0 132 Q720 128 1440 132" fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1" />
          {/* five phase groups instead of one animation per bulb */}
          {LIGHT_COLORS.map((color, phase) => (
            <g key={color} className="twinkle" style={{ "--d": `${-phase * 0.5}s` } as React.CSSProperties}>
              {SKYLINE.lights.filter((_, i) => i % LIGHT_COLORS.length === phase).map((x) => (
                <circle key={x} cx={x} cy={131} r="3" fill={color} />
              ))}
            </g>
          ))}
        </>
      )}
    </svg>
  );
}
