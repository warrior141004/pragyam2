/* eslint-disable @next/next/no-img-element -- Unsplash serves its own resized, cached images; hotlinking is what its licence asks for. */
import { pickPhoto, photoSrc as src } from "@/components/events/eventPhoto";

/** Brand colour per category: shown while the photo loads, and tints it so every card still feels on-theme. */
const PALETTE: Record<string, string> = {
  Technical: "#4d1a78",
  Gaming: "#150c3f",
  Creative: "#ff7a1a",
  Cultural: "#f28c28",
  Quiz: "#3fb99a",
  Competition: "#d63a6a",
  "Fun Activity": "#2ec27e",
  Other: "#3a2213",
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

  return (
    <div className={`relative overflow-hidden border-b-2 border-ink ${className}`} style={{ background: tint }}>
      <img
        src={src(id, 640)}
        srcSet={`${src(id, 480)} 480w, ${src(id, 640)} 640w, ${src(id, 960)} 960w`}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* category tint at the bottom keeps the photo on-brand and the letter readable */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${tint}d9 0%, ${tint}33 45%, transparent 75%)` }} aria-hidden />
      <span className="font-display pointer-events-none absolute -bottom-5 left-3 text-[6rem] leading-none text-white/30">
        {category.charAt(0)}
      </span>
    </div>
  );
}
