"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SPONSOR } from "@/config/event";

/**
 * The sponsor wordmark, revealed cinematically the first time it scrolls into view: the logo wipes
 * on from the left, pushing in out of a blur before settling at its natural size. Falls back to the
 * static logo for visitors who prefer reduced motion (see the media query in globals.css).
 */
export default function SponsorLogoReveal() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, clipPath: "inset(0 100% 0 0)", scale: 1.1, y: 14, filter: "blur(10px)" },
        {
          opacity: 1,
          clipPath: "inset(0 0% 0 0)",
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <a
      href={SPONSOR.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${SPONSOR.name} website`}
      className="mt-5 flex w-full max-w-[360px] overflow-hidden rounded-md border-2 border-ink bg-white px-5 py-4 shadow-[5px_5px_0_var(--ink)] transition-transform hover:-translate-y-0.5"
    >
      <span ref={ref} className="sponsor-reveal block w-full">
        <Image
          src="/images/adhirohah_logo.webp"
          alt={SPONSOR.name}
          width={1024}
          height={276}
          className="h-auto w-full"
        />
      </span>
    </a>
  );
}
