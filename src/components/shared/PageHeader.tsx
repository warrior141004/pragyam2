import type { ReactNode } from "react";
import { Waves } from "@/components/home/Decor";

export default function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  tone?: "cyan" | "violet" | "pink" | "amber";
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="animate-fade-up">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-orange">{eyebrow}</p>
      <Waves className="mt-2 h-3 w-24 text-teal" />
      <h1 className="font-display mt-4 text-4xl leading-[0.95] text-ink sm:text-6xl">{title}</h1>
      {lede && <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">{lede}</p>}
      {children}
    </header>
  );
}
