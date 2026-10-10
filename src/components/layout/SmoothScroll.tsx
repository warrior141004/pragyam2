"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/lenis";

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
      smoothWheel: true,
      anchors: true,
    });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Hold scrolling while the intro curtain is up; release when it clears.
    const html = document.documentElement;
    const sync = () => (html.classList.contains("has-intro") ? lenis.stop() : lenis.start());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    // Scroll-scrubbed reveals measure positions up front; when content loads later (event grids,
    // photos) the page grows, so re-measure — debounced so a burst of changes costs one refresh.
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    const resize = new ResizeObserver(() => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    resize.observe(document.body);

    return () => {
      resize.disconnect();
      clearTimeout(refreshTimer);
      observer.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
