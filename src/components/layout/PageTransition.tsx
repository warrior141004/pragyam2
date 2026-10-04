"use client";

import { type ReactNode, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { scrollToTop } from "@/lib/lenis";

/**
 * Sun-iris page transitions. Clicking an internal link blooms an indigo disc
 * out from the pointer, a marigold sun rises in the middle, the route changes
 * underneath, and once the new page has rendered the iris closes back to the
 * same point. Back/forward navigation skips the iris and relies on the page
 * enter animation in app/template.tsx.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);
  const origin = useRef({ x: 50, y: 50 });
  const failsafe = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reveal = useCallback(() => {
    const overlay = overlayRef.current;
    const sun = sunRef.current;
    if (!overlay || !sun) return;
    const { x, y } = origin.current;
    gsap
      .timeline({ onComplete: () => gsap.set(overlay, { visibility: "hidden" }) })
      .to(sun, { scale: 0.5, opacity: 0, duration: 0.3, ease: "power2.in" })
      .to(overlay, { clipPath: `circle(0% at ${x}% ${y}%)`, duration: 0.7, ease: "power3.inOut" }, "-=0.1");
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
      const sun = sunRef.current;
      if (!overlay || !sun) {
        router.push(href);
        return;
      }

      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      origin.current = { x, y };

      gsap.set(overlay, { visibility: "visible", clipPath: `circle(0% at ${x}% ${y}%)` });
      gsap.set(sun, { scale: 0.5, opacity: 0 });
      gsap
        .timeline({
          onComplete: () => {
            router.push(href);
            // If the route never resolves (network error, aborted), don't trap the user behind the iris.
            failsafe.current = setTimeout(() => {
              if (pending.current) {
                pending.current = null;
                reveal();
              }
            }, 6000);
          },
        })
        .to(overlay, { clipPath: `circle(150% at ${x}% ${y}%)`, duration: 0.75, ease: "power3.inOut" })
        .to(sun, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }, "-=0.4");
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
        <div ref={sunRef} className="pt-sun">
          <div className="pt-ring pt-ring-a" />
          <div className="pt-ring pt-ring-b" />
          <div className="pt-disc">
            <Image src="/images/pragyam-logo-dark.png" alt="" width={60} height={60} className="h-14 w-14" />
          </div>
        </div>
      </div>
    </>
  );
}
