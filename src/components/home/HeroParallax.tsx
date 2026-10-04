"use client";

import { type ReactNode, useEffect, useRef } from "react";

const PHASES = ["dawn", "day", "dusk", "night"] as const;
type Phase = (typeof PHASES)[number];

function phaseFor(hour: number): Phase {
  if (hour >= 5 && hour < 9) return "dawn";
  if (hour >= 9 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}

/**
 * Drives the hero's depth layers through CSS variables (--mx, --my for the
 * pointer, --sy for scroll progress) and picks the sky palette from the
 * visitor's local time. `?sky=night` (dawn|day|dusk|night) forces a phase.
 */
export default function HeroParallax({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const forced = new URLSearchParams(window.location.search).get("sky") as Phase | null;
    el.dataset.sky = forced && PHASES.includes(forced) ? forced : phaseFor(new Date().getHours());

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let sy = 0;
    let raf = 0;

    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty("--mx", cx.toFixed(4));
      el.style.setProperty("--my", cy.toFixed(4));
      el.style.setProperty("--sy", sy.toFixed(4));
      raf = Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      kick();
    };
    const onScroll = () => {
      sy = Math.min(1, Math.max(0, window.scrollY / Math.max(1, el.offsetHeight)));
      kick();
    };

    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      if (fine) window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
}
