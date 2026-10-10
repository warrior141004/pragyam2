"use client";

import { type ReactNode, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToTop } from "@/lib/lenis";

/** What the transition card says for each destination. */
const LABELS: [RegExp, string][] = [
  [/^\/$/, "Home"],
  [/^\/events\/[^/]+/, "The event"],
  [/^\/events/, "Events"],
  [/^\/host/, "Host an event"],
  [/^\/about/, "About the fest"],
  [/^\/contact/, "Contact"],
  [/^\/status/, "Check status"],
  [/^\/manage/, "Manage"],
  [/^\/admin/, "Organizers"],
];
const labelFor = (path: string) => LABELS.find(([re]) => re.test(path))?.[1] ?? "Pragyam 2.0";

/**
 * Cinematic page transitions. Clicking an internal link closes black letterbox bars from the top and
 * bottom while the current page dips back; the P mark and the destination's name rise in the middle;
 * the route changes underneath; then the bars open on the new page, which settles in from a slight zoom.
 * Back/forward navigation skips the bars and relies on the page enter animation in app/template.tsx.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pending = useRef<string | null>(null);
  const failsafe = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reveal = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const main = document.querySelector<HTMLElement>("main");
    gsap
      .timeline({
        onComplete: () => {
          gsap.set(overlay, { visibility: "hidden" });
          if (main) gsap.set(main, { clearProps: "transform,opacity,transformOrigin" });
          // the new page's reveals were measured mid-zoom; measure again at rest
          ScrollTrigger.refresh();
        },
      })
      .to(cardRef.current, { opacity: 0, y: -18, filter: "blur(6px)", duration: 0.35, ease: "power2.in" })
      .to(topRef.current, { scaleY: 0, duration: 0.9, ease: "expo.inOut" }, "-=0.1")
      .to(bottomRef.current, { scaleY: 0, duration: 0.9, ease: "expo.inOut" }, "<")
      .fromTo(
        main,
        // scale + opacity only: blurring the whole page is too heavy for low-end phones
        { scale: 1.04, opacity: 0, transformOrigin: "50% 30%" },
        { scale: 1, opacity: 1, duration: 1.1, ease: "expo.out" },
        "<+0.15"
      );
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      event.preventDefault();
      if (pending.current) return;

      const href = url.pathname + url.search;
      pending.current = href;
      router.prefetch(href);

      const overlay = overlayRef.current;
      if (!overlay) {
        router.push(href);
        return;
      }

      if (labelRef.current) labelRef.current.textContent = labelFor(url.pathname);
      const main = document.querySelector<HTMLElement>("main");

      gsap.set(overlay, { visibility: "visible" });
      gsap.set([topRef.current, bottomRef.current], { scaleY: 0 });
      gsap.set(cardRef.current, { opacity: 0, y: 0, filter: "blur(0px)" });
      gsap
        .timeline({
          onComplete: () => {
            router.push(href);
            // If the route never resolves (network error, aborted), don't trap the user behind the bars.
            failsafe.current = setTimeout(() => {
              if (pending.current) {
                pending.current = null;
                reveal();
              }
            }, 6000);
          },
        })
        // the current page dips back as the letterbox closes over it
        .to(main, { scale: 0.96, opacity: 0.5, transformOrigin: "50% 30%", duration: 0.7, ease: "power3.in" }, 0)
        .to(topRef.current, { scaleY: 1, duration: 0.7, ease: "expo.inOut" }, 0)
        .to(bottomRef.current, { scaleY: 1, duration: 0.7, ease: "expo.inOut" }, 0)
        // the mark and the destination rise in the middle
        .to(cardRef.current, { opacity: 1, duration: 0.2 }, 0.5)
        .fromTo(
          cardRef.current?.querySelector(".pt-mark") ?? null,
          { opacity: 0, scale: 0.8, filter: "blur(8px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "power3.out" },
          0.5
        )
        .fromTo(
          labelRef.current,
          { yPercent: 110, letterSpacing: "0.3em" },
          { yPercent: 0, letterSpacing: "0.06em", duration: 0.6, ease: "power4.out" },
          0.58
        );
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router, reveal]);

  useEffect(() => {
    if (!pending.current) return;
    pending.current = null;
    if (failsafe.current) clearTimeout(failsafe.current);
    scrollToTop(true);
    reveal();
  }, [pathname, reveal]);

  return (
    <>
      {children}
      <div ref={overlayRef} aria-hidden className="pt-overlay">
        <div ref={topRef} className="pt-bar pt-bar-top" />
        <div ref={bottomRef} className="pt-bar pt-bar-bottom" />
        <div ref={cardRef} className="pt-card">
          <Image src="/images/pragyam-logo.png" alt="" width={56} height={56} className="pt-mark" />
          <span className="pt-label-mask">
            <span ref={labelRef} className="pt-label font-display">
              Pragyam 2.0
            </span>
          </span>
        </div>
      </div>
    </>
  );
}
