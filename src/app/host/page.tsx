"use client";

import { useState } from "react";
import Link from "next/link";
import HostForm from "@/components/host/HostForm";
import PageHeader from "@/components/shared/PageHeader";

const NOTES = [
  { title: "Review in days, not weeks", desc: "Organizers look at every proposal and reply by email." },
  { title: "You own the event", desc: "Registrations go straight to your inbox as they arrive." },
  { title: "Edit and manage anytime", desc: "After approval, a private link in your email lets only you edit the event and manage its participants." },
];

export default function HostPage() {
  const [done, setDone] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      <PageHeader
        eyebrow="Host"
        tone="violet"
        title={
          <>
            Propose <span className="font-display text-orange">your event</span>
          </>
        }
        lede="Tell us about the idea. Our organizers will review it and you'll get an email as soon as it's approved."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {done ? (
            <div className="glass-strong glass-sheen tint-emerald rounded-md p-10 text-center">
              <span className="chip">
                <i className="dot bg-current text-teal" />
                Submitted
              </span>
              <p className="font-display mt-6 text-3xl font-bold text-ink">
                Proposal <span className="font-display text-teal">received.</span>
              </p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink/70">
                It&apos;s with the Pragyam 2.0 team now. Once it&apos;s approved we&apos;ll email you a private manage link: it&apos;s the only way to edit your event and manage participants, so keep it safe.
              </p>
              <Link href="/events" className="btn btn-glass mt-8">
                Explore approved events
              </Link>
            </div>
          ) : (
            <HostForm onDone={() => setDone(true)} />
          )}
        </div>

        <aside className="animate-fade-up space-y-4 lg:col-span-2 lg:sticky lg:top-28 lg:self-start">
          {NOTES.map((n, i) => (
            <div
              key={n.title}
              className={`glass glass-sheen rounded-md p-6 ${["tint-violet", "tint-cyan", "tint-pink"][i]}`}
            >
              <p className="font-display text-base font-semibold text-ink">{n.title}</p>
              <p className="mt-1.5 text-sm text-ink/76">{n.desc}</p>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
