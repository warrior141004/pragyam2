"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Waves } from "@/components/home/Decor";
import { EVENT } from "@/config/event";

/**
 * The `has-intro` class is set on <html> by an inline script in the document
 * head before first paint (see layout.tsx), so this overlay is already visible
 * when the page first renders and the site never flashes underneath it.
 */
export default function IntroPreloader() {
  const [done, setDone] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!document.documentElement.classList.contains("has-intro")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intro was skipped by the head script
      setDone(true);
      return;
    }

    const counter = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.classList.remove("has-intro");
        setDone(true);
      },
    });

    tl.fromTo(logoRef.current, { scale: 0.6, opacity: 0, rotate: -8 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: "back.out(1.8)" })
      .fromTo(
        contentRef.current?.querySelectorAll("[data-stagger]") ?? [],
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" },
        "-=0.3"
      )
      .to(
        counter,
        {
          val: 100,
          duration: 1.4,
          ease: "power2.inOut",
          onUpdate: () => {
            if (pctRef.current) pctRef.current.textContent = String(Math.round(counter.val));
          },
        },
        "-=0.2"
      )
      .to(barRef.current, { width: "100%", duration: 1.4, ease: "power2.inOut" }, "<")
      .to(contentRef.current, { opacity: 0, y: -20, scale: 0.96, duration: 0.4, ease: "power2.in" }, "+=0.15")
      .to(topRef.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "-=0.1")
      .to(bottomRef.current, { yPercent: 100, duration: 0.9, ease: "power4.inOut" }, "<");

    return () => {
      tl.kill();
      document.documentElement.classList.remove("has-intro");
    };
  }, []);

  if (done) return null;

  return (
    <div role="status" aria-label="Loading Pragyam 2.0" className="intro fixed inset-0 z-[100] overflow-hidden">
      <div ref={topRef} className="intro-panel intro-top" />
      <div ref={bottomRef} className="intro-panel intro-bottom" />

      <div ref={contentRef} className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div ref={logoRef} className="opacity-0">
          <Image src="/images/pragyam-logo-dark.png" alt="" width={84} height={84} priority className="h-20 w-20" />
        </div>
        <p data-stagger className="font-display text-5xl leading-none text-ink opacity-0 sm:text-7xl">
          Pragyam <span className="text-orange">2.0</span>
        </p>
        <div data-stagger className="opacity-0">
          <Waves className="h-3 w-40 text-orange" />
        </div>
        <div data-stagger className="mt-2 h-1.5 w-56 overflow-hidden rounded-sm bg-ink/10 opacity-0">
          <div ref={barRef} className="h-full w-0 bg-orange" />
        </div>
        <p data-stagger className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-ink opacity-0">
          Loading <span ref={pctRef}>0</span>%
        </p>
        <p data-stagger className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/55 opacity-0">
          {EVENT.dateShort} · CURAJ
        </p>
      </div>
    </div>
  );
}
