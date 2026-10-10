"use client";

import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/**
 * Apple-style scroll choreography. The block's motion is tied to the scroll position (scrubbed, and
 * smoothed by Lenis): it rises, grows and fades in as it enters, holds while it's being read, then dips
 * back and fades as it leaves the top — so content "opens" and "closes" with the scroll.
 *
 * `delay` (seconds, as before) now starts the entrance a little later in the scroll, so neighbouring
 * blocks still stagger.
 */
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const offset = Math.round(delay * 160);

      // enter: from just below the fold until the block's top reaches ~60% of the viewport
      gsap.fromTo(
        el,
        { opacity: 0, y: y * 2.2, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: `top bottom-=${offset}`,
            end: `top 60%-=${offset}`,
            scrub: 0.6,
          },
        }
      );

      // exit: as the block's bottom passes the top fifth of the screen it dips back and fades
      gsap.to(el, {
        opacity: 0.25,
        y: -36,
        scale: 0.97,
        ease: "power1.in",
        immediateRender: false,
        scrollTrigger: {
          trigger: el,
          start: "bottom 22%",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [delay, y]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
