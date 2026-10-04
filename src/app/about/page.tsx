import ScrollReveal from "@/components/shared/ScrollReveal";
import PageHeader from "@/components/shared/PageHeader";

const PILLARS = [
  { title: "Innovation", desc: "Space for bold, original ideas from every student.", tint: "tint-violet" },
  { title: "Technology", desc: "A showcase of what the CS department builds and explores.", tint: "tint-cyan" },
  { title: "Creativity", desc: "Room for art, design, gaming and everything in between.", tint: "tint-pink" },
  { title: "Collaboration", desc: "Built by students, for students — together.", tint: "tint-amber" },
  { title: "Artificial Intelligence", desc: "The theme running through every corner of the fest.", tint: "tint-emerald" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      <PageHeader
        eyebrow="About"
        tone="pink"
        title={
          <>
            A fest built by the people <span className="font-display text-orange">who show up</span>
          </>
        }
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        <ScrollReveal className="glass glass-sheen rounded-md p-8 sm:p-10 lg:col-span-3">
          <p className="text-lg leading-relaxed text-ink/75">
            Pragyam 2.0 is a student-driven fest organized by the Department of Computer Science,
            Central University of Rajasthan. Built around the theme of Artificial Intelligence, it
            brings together technical competitions, creative showcases and fun activities dreamed up
            and run by students themselves.
          </p>
          <div className="hairline my-8" />
          <p className="text-lg leading-relaxed text-ink/75">
            Anyone in the department can propose an event, and every student can take part in what
            gets approved. No logins, no dashboards —{" "}
            <span className="font-display text-ink">just ideas, proposals and participation.</span>
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="glass-strong glass-sheen tint-violet flex flex-col justify-between rounded-md p-8 lg:col-span-2">
          <div>
            <p className="font-display text-6xl text-ink/90">2.0</p>
            <p className="mt-2 text-sm text-ink/76">Second edition</p>
          </div>
          <div className="mt-10 space-y-3 text-sm">
            <Row k="Organized by" v="Dept. of Computer Science" />
            <Row k="University" v="Central University of Rajasthan" />
            <Row k="Theme" v="Artificial Intelligence" />
          </div>
        </ScrollReveal>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((p, i) => (
          <ScrollReveal key={p.title} delay={i * 0.06} className={`glass glass-sheen ${p.tint} rounded-md p-6`}>
            <p className="font-display text-2xl text-ink/35">0{i + 1}</p>
            <h3 className="font-display mt-3 text-xl font-semibold text-ink">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/76">{p.desc}</p>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-ink/10 pb-3 last:border-0 last:pb-0">
      <span className="text-ink/66">{k}</span>
      <span className="text-right text-ink">{v}</span>
    </div>
  );
}
