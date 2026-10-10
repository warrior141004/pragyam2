"use client";

/* eslint-disable @next/next/no-img-element -- Unsplash serves its own resized, cached images; hotlinking is what its licence asks for. */
import { useState } from "react";
import { pickPhoto, photoSrc as src } from "@/components/events/eventPhoto";

/** Brand colour per category: shown while the photo loads, and tints it so every card still feels on-theme. */
const PALETTE: Record<string, string> = {
  Technical: "#0d0d0d",
  Gaming: "#0d0d0d",
  Creative: "#0d0d0d",
  Cultural: "#0d0d0d",
  Quiz: "#0d0d0d",
  Competition: "#0d0d0d",
  "Fun Activity": "#0d0d0d",
  Other: "#0d0d0d",
};

export default function CategoryArt({
  category,
  seed,
  title = "",
  description = "",
  className = "",
}: {
  category: string;
  seed: string;
  title?: string;
  description?: string;
  className?: string;
}) {
  const tint = PALETTE[category] ?? PALETTE.Other;
  const [id, alt] = pickPhoto(category, seed, title, description);
  // Fade the photo in once it has loaded; the category colour shows underneath until then.
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden border-b-2 border-ink ${className}`} style={{ background: tint }}>
      <img
        src={src(id, 640)}
        srcSet={id.startsWith("/") ? undefined : `${src(id, 480)} 480w, ${src(id, 640)} 640w, ${src(id, 960)} 960w`}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        alt={alt}
        loading="lazy"
        decoding="async"
        // a cached photo can finish loading before React attaches onLoad, so check on mount too
        ref={(img) => {
          if (img?.complete && img.naturalWidth > 0) setLoaded(true);
        }}
        onLoad={() => setLoaded(true)}
        className={`photo-fade absolute inset-0 h-full w-full object-cover group-hover:scale-105 ${loaded ? "is-loaded" : ""}`}
      />
      {/* category tint at the bottom keeps the photo on-brand and the letter readable */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${tint}d9 0%, ${tint}33 45%, transparent 75%), linear-gradient(135deg, rgba(217, 4, 41, 0.16) 0%, transparent 55%)` }} aria-hidden />
      <span className="font-display pointer-events-none absolute -bottom-5 left-3 text-[6rem] leading-none text-white/30">
        {category.charAt(0)}
      </span>
    </div>
  );
}
