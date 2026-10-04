"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
}

export interface ResizableNavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Links shown in the bar (and in the mobile menu) */
  items: NavItem[];
  /** Brand mark or logo link on the left */
  logo?: React.ReactNode;
  /** Call to action on the right (e.g. a sign-up link) */
  cta?: React.ReactNode;
  /** Pixels scrolled before the bar shrinks into a floating pill */
  threshold?: number;
  /** Maximum width of the floating pill, in px */
  compactWidth?: number;
  /** Maximum width of the full bar, in px */
  maxWidth?: number;
  /** href of the current page; that link gets aria-current="page" */
  activeHref?: string;
  /** Accessible name of the navigation landmark */
  label?: string;
  /** Scrollable element to watch instead of the window */
  container?: React.RefObject<HTMLElement | null>;
}

/**
 * Sticky navbar that shrinks into a centred, frosted pill once the page is
 * scrolled. A highlight glides between links on hover and focus; below a
 * 48rem container width the links move into a disclosure menu.
 *
 * Ported from Velora UI's Resizable Navbar (MIT) to CSS transitions so it
 * needs no animation runtime.
 */
export function ResizableNavbar({
  items,
  logo,
  cta,
  threshold = 80,
  compactWidth = 760,
  maxWidth = 1152,
  activeHref,
  label = "Main",
  container,
  className,
  ...props
}: ResizableNavbarProps) {
  const [compact, setCompact] = useState(false);
  const [hover, setHover] = useState({ left: 0, width: 0, on: false, moved: false });
  const [menuOpen, setMenuOpen] = useState(false);
  const id = useId();
  const rootRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = container?.current;
    const target = el ?? window;
    // Same-value state updates bail out, so no throttling is needed.
    const update = () => setCompact((el ? el.scrollTop : window.scrollY) > threshold);
    update();
    target.addEventListener("scroll", update, { passive: true });
    return () => target.removeEventListener("scroll", update);
  }, [container, threshold]);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen]);

  // The highlight glides between links; appearing from nothing it fades in place.
  const show = ({ currentTarget: t }: React.SyntheticEvent<HTMLElement>) =>
    setHover((h) => ({ left: t.offsetLeft, width: t.offsetWidth, on: true, moved: h.on }));
  const hide = () => setHover((h) => ({ ...h, on: false }));

  const link = (item: NavItem, inMenu: boolean) => (
    <Link
      href={item.href}
      aria-current={item.href === activeHref ? "page" : undefined}
      onMouseEnter={inMenu ? undefined : show}
      onFocus={inMenu ? undefined : show}
      onClick={() => setMenuOpen(false)}
      className={cn(
        "relative block rounded-full px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange aria-[current=page]:text-orange",
        inMenu && "rounded-md px-4 py-3 text-xs hover:bg-white/10"
      )}
    >
      {item.label}
    </Link>
  );

  return (
    <header
      {...props}
      ref={rootRef}
      data-slot="resizable-navbar"
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          setMenuOpen(false);
          buttonRef.current?.focus();
        }
        props.onKeyDown?.(event);
      }}
      className={cn("@container/navbar sticky top-0 z-50 w-full px-3 pt-3", className)}
    >
      <nav
        aria-label={label}
        style={{ maxWidth: compact ? compactWidth : maxWidth, transform: `translateY(${compact ? 6 : 0}px)` }}
        className={cn(
          "frost-nav relative mx-auto flex h-14 items-center gap-4 rounded-full border px-4 transition-[max-width,transform,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          compact || menuOpen ? "frost-nav-compact" : "frost-nav-full"
        )}
      >
        <div className="flex shrink-0 items-center">{logo}</div>

        <div className="hidden flex-1 justify-center @3xl/navbar:flex">
          <div
            onMouseLeave={hide}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) hide();
            }}
            className="relative"
          >
            <span
              aria-hidden
              style={{ transform: `translateX(${hover.left}px)`, width: hover.width, opacity: hover.on ? 1 : 0 }}
              className={cn(
                "absolute inset-y-0 left-0 rounded-full bg-white/10 motion-reduce:transition-none",
                hover.moved
                  ? "transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  : "transition-opacity duration-150"
              )}
            />
            <ul className="flex items-center gap-1">
              {items.map((item, i) => (
                <li key={`${i}-${item.label}`}>{link(item, false)}</li>
              ))}
            </ul>
          </div>
        </div>

        {cta && <div className="hidden shrink-0 @3xl/navbar:block">{cta}</div>}

        <button
          ref={buttonRef}
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          aria-controls={`${id}-menu`}
          onClick={() => setMenuOpen((open) => !open)}
          className="group/menu ml-auto grid size-9 cursor-pointer place-items-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange @3xl/navbar:hidden"
        >
          <span aria-hidden className="relative block h-3 w-4">
            <span className="absolute top-0 left-0 h-0.5 w-4 rounded-full bg-white transition-transform duration-200 group-aria-expanded/menu:translate-y-[5px] group-aria-expanded/menu:rotate-45 motion-reduce:transition-none" />
            <span className="absolute bottom-0 left-0 h-0.5 w-4 rounded-full bg-white transition-transform duration-200 group-aria-expanded/menu:-translate-y-[5px] group-aria-expanded/menu:-rotate-45 motion-reduce:transition-none" />
          </span>
        </button>

        <div
          id={`${id}-menu`}
          inert={!menuOpen}
          className={cn(
            "frost-menu absolute inset-x-0 top-full mt-2 rounded-md border border-white/10 p-2 transition-[opacity,transform] duration-200 @3xl/navbar:hidden motion-reduce:transition-none",
            menuOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
          )}
        >
          <ul>
            {items.map((item, i) => (
              <li key={`${i}-${item.label}`}>{link(item, true)}</li>
            ))}
          </ul>
          {cta && <div className="mt-2 border-t border-white/10 p-2 pt-3">{cta}</div>}
        </div>
      </nav>
    </header>
  );
}
