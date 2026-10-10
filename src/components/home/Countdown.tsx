"use client";

import { Fragment, useEffect, useState } from "react";
import { fetchApprovedEvents } from "@/lib/eventsClient";

type Parts = { d: number; h: number; m: number; s: number };

function split(ms: number): Parts {
  const total = Math.floor(ms / 1000);
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

function milestone(d: number) {
  if (d === 0) return "Day zero. The idea machine is switched on.";
  if (d < 7) return `Day ${d}: proposals are rolling in.`;
  if (d < 30) return `Day ${d}: the schedule is taking shape.`;
  return `Day ${d} of the build-up — the date drops soon.`;
}

/** Each digit remounts when it changes, so the CSS pop plays like an odometer. */
function Cell({ value, label }: { value: number | undefined; label: string }) {
  const str = value === undefined ? "--" : String(value).padStart(2, "0");
  return (
    <div className="min-w-[3rem] text-center sm:min-w-[5rem]">
      <div className="flex justify-center">
        {str.split("").map((ch, i) => (
          <span key={`${i}-${ch}`} className="count-digit digit-pop inline-block">
            {ch}
          </span>
        ))}
      </div>
      <p className="count-label mt-2">{label}</p>
    </div>
  );
}

function useCountUp(target: number, duration = 1200) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

function Pulse() {
  const [stats, setStats] = useState<{ events: number; seats: number; tracks: number } | null>(null);

  useEffect(() => {
    fetchApprovedEvents().then((list) =>
      setStats({
        events: list.length,
        seats: list.reduce((sum, e) => sum + (e.approvedCount || 0), 0),
        tracks: new Set(list.map((e) => e.category)).size,
      })
    );
  }, []);

  const events = useCountUp(stats?.events ?? 0);
  const seats = useCountUp(stats?.seats ?? 0);
  const tracks = useCountUp(stats?.tracks ?? 0);

  const tiles = [
    { n: events, label: "Events approved", tint: "tint-emerald" },
    { n: seats, label: "Seats claimed", tint: "tint-amber" },
    { n: tracks, label: "Tracks live", tint: "tint-pink" },
  ];

  return (
    <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
      {tiles.map((t) => (
        <div key={t.label} className={`glass ${t.tint} rounded-md px-3 py-4 sm:px-5 sm:py-5`}>
          <p className="font-display text-3xl leading-none text-ink sm:text-4xl">{stats ? t.n : "–"}</p>
          <p className="mt-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink/70">{t.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function Countdown({ target, since }: { target?: string | null; since: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const down = Boolean(target);
  let parts: Parts | undefined;
  let live = false;
  if (now !== null) {
    if (down) {
      const ms = new Date(target as string).getTime() - now;
      if (ms <= 0) live = true;
      else parts = split(ms);
    } else {
      parts = split(Math.max(0, now - new Date(since).getTime()));
    }
  }

  const cells: [string, number | undefined][] = [
    [down ? "Days" : "Days in", parts?.d],
    ["Hours", parts?.h],
    ["Minutes", parts?.m],
    ["Seconds", parts?.s],
  ];

  return (
    <div>
      <span className="chip">
        <i className={`dot bg-current ${down ? "text-orange" : "animate-pulse text-teal"}`} />
        {down ? "Countdown" : "Hype clock · live"}
      </span>

      <h2 className="font-display mt-6 text-3xl text-ink sm:text-5xl">
        {down ? (
          <>
            Doors open <span className="text-orange">in</span>
          </>
        ) : (
          <>
            The build-up has <span className="text-orange">begun</span>
          </>
        )}
      </h2>

      {!down && (
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink/70 sm:text-base">
          No date yet — but the fest is already in motion. This clock started the moment Pragyam 2.0 was announced, and
          it won&apos;t stop until the doors open.
        </p>
      )}

      {live ? (
        <p className="font-display mt-8 text-4xl text-orange sm:text-5xl">It&apos;s happening now!</p>
      ) : (
        <div className="mt-8 flex items-start justify-center gap-1.5 sm:gap-7">
          {cells.map(([label, v], i) => (
            <Fragment key={label}>
              {i > 0 && <span className="count-digit pt-0.5 !text-ink/60 !text-shadow-none">:</span>}
              <Cell value={v} label={label} />
            </Fragment>
          ))}
        </div>
      )}

      {!down && parts && (
        <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.2em] text-teal-deep">{milestone(parts.d)}</p>
      )}

      <Pulse />
    </div>
  );
}
