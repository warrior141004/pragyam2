"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EVENT } from "@/config/event";

/**
 * Cinematic opening: black screen → the P mark pulls into focus → "PRAGYAM 2.0" rises letter by letter
 * while its tracking tightens → the title blurs away → black letterbox bars open on the site, which
 * settles in from a slight zoom. Click or press any key to skip.
 *
 * The `has-intro` class is set on <html> by an inline script in the document head before first paint
 * (see layout.tsx), so this overlay is already up when the page first renders and nothing flashes.
 */
export default function IntroPreloader() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const verRef = useRef<HTMLSpanElement>(null);
  const metaRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("has-intro")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intro was skipped by the head script
      setDone(true);
      return;
    }

    const root = rootRef.current;
    const site = document.querySelector<HTMLElement>(".site");
    const chars = nameRef.current?.querySelectorAll<HTMLElement>("[data-char]") ?? [];
    // keep the overlay mounted while the bars open, even after `has-intro` is lifted
    root?.classList.add("is-playing");

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        if (site) gsap.set(site, { clearProps: "transform,opacity,transformOrigin" });
        // positions were measured while the site was zoomed; measure again now it's at rest
        ScrollTrigger.refresh();
        setDone(true);
      },
    });
    tlRef.current = tl;

    tl
      // 1. the mark pulls into focus
      .fromTo(logoRef.current, { opacity: 0, scale: 0.82, filter: "blur(14px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.1 }, 0.2)
      // 2. the name rises out of a mask, letter by letter, while its tracking tightens
      //    (letters start below their masks via GSAP, so nothing shows before the timeline runs)
      .set(chars, { yPercent: 115 }, 0)
      .set(nameRef.current, { opacity: 1 }, 0.85)
      .to(chars, { yPercent: 0, duration: 0.9, stagger: 0.06, ease: "power4.out" }, 0.9)
      .fromTo(nameRef.current, { letterSpacing: "0.42em" }, { letterSpacing: "0.04em", duration: 1.7, ease: "power3.out" }, 0.9)
      .fromTo(verRef.current, { opacity: 0, scale: 0.6, rotate: -14 }, { opacity: 1, scale: 1, rotate: -6, duration: 0.6, ease: "back.out(2)" }, 1.6)
      // 3. the credit line and a thin progress rule
      .fromTo(metaRef.current, { opacity: 0, letterSpacing: "0.6em" }, { opacity: 0.75, letterSpacing: "0.3em", duration: 1.1 }, 1.7)
      .fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: "power2.inOut" }, 0.9)
      // 4. the title blurs away…
      .to(stageRef.current, { opacity: 0, scale: 1.06, filter: "blur(10px)", duration: 0.6, ease: "power2.in" }, "+=0.45")
      // …and the letterbox opens on the site, which settles in from a slight zoom
      .add(() => html.classList.remove("has-intro"), "open")
      .to(topRef.current, { yPercent: -100, duration: 1.15, ease: "expo.inOut" }, "open")
      .to(bottomRef.current, { yPercent: 100, duration: 1.15, ease: "expo.inOut" }, "open")
      .fromTo(
        site,
        { scale: 1.08, transformOrigin: "50% 40%" },
        { scale: 1, duration: 1.6, ease: "expo.out" },
        "open+=0.15"
      );

    // Click or any key skips ahead.
    const skip = () => tl.timeScale(4);
    window.addEventListener("keydown", skip, { once: true });

    return () => {
      window.removeEventListener("keydown", skip);
      tl.kill();
      if (site) gsap.set(site, { clearProps: "transform,opacity,transformOrigin" });
      // Leave `has-intro` alone here: in development React mounts, unmounts and re-mounts every
      // component, and lifting the flag in between made the second mount skip the intro entirely.
      // The intro lives in the root layout, so it never unmounts for real while playing.
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label={`Loading ${EVENT.name}`}
      className="intro fixed inset-0 z-[100] overflow-hidden"
      onClick={() => tlRef.current?.timeScale(4)}
    >
      <div ref={topRef} className="intro-bar intro-bar-top" />
      <div ref={bottomRef} className="intro-bar intro-bar-bottom" />

      <div ref={stageRef} className="intro-stage">
        <div ref={logoRef} className="intro-logo">
          <Image src="/images/pragyam-logo.png" alt="" width={112} height={112} priority />
        </div>

        <p ref={nameRef} className="intro-name font-display" aria-hidden>
          {"PRAGYAM".split("").map((ch, i) => (
            <span key={i} className="intro-mask">
              <span data-char className="intro-char">
                {ch}
              </span>
            </span>
          ))}
          <span ref={verRef} className="intro-ver">
            2.0
          </span>
        </p>

        <div className="intro-rule">
          <div ref={lineRef} className="intro-rule-fill" />
        </div>

        <p ref={metaRef} className="intro-meta">
          {EVENT.org} · CURAJ · {EVENT.dateShort}
        </p>
      </div>

      <p className="intro-skip">Tap to skip</p>
    </div>
  );
}
