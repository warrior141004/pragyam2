"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  "Technical",
  "Gaming",
  "Creative",
  "Cultural",
  "Quiz",
  "Competition",
  "Fun Activity",
  "Other",
];

const initial = {
  proposerName: "",
  proposerEmail: "",
  proposerPhone: "",
  title: "",
  category: "Technical",
  description: "",
  rules: "",
  expectedParticipants: "",
  maxParticipants: "",
  duration: "",
  venueRequirements: "",
  equipmentRequirements: "",
  preferredDate: "",
  preferredTime: "",
  additionalInfo: "",
};

const label = "mb-1.5 block text-xs font-medium text-ink/76";

export default function HostForm({ onDone }: { onDone: () => void }) {
  const [fromCs, setFromCs] = useState<boolean | null>(null);
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          expectedParticipants: Number(form.expectedParticipants),
          maxParticipants: Number(form.maxParticipants),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      onDone();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (fromCs !== true) {
    return (
      <div className="glass-strong animate-fade-up rounded-md p-6 sm:p-8">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-orange">Before we start</p>
        <h3 className="font-display mt-3 text-2xl leading-tight text-ink sm:text-3xl">
          Are you a student of the Department of Computer Science, CURAJ?
        </h3>
        <p className="mt-3 text-sm text-ink/70">
          Only students of the department can host an event at Pragyam 2.0. Everyone can still take part.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setFromCs(true)}
            className={`btn w-full ${fromCs === false ? "btn-glass" : "btn-primary"}`}
          >
            Yes, I&apos;m from CS
          </button>
          <button
            type="button"
            onClick={() => setFromCs(false)}
            className={`btn w-full ${fromCs === false ? "btn-orange" : "btn-glass"}`}
          >
            No, another department
          </button>
        </div>

        {fromCs === false && (
          <div className="mt-6 rounded-md border border-orange/40 bg-cream p-5 animate-fade-up">
            <p className="font-display text-xl text-ink">Hosting is for CS students only</p>
            <p className="mt-2 text-sm text-ink/70">
              You can still register for any approved event — solo or with a team — and be part of the fest.
            </p>
            <Link href="/events" className="btn btn-primary btn-sm mt-4">
              Browse events
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="animate-fade-up space-y-5">
      {error && <p className="alert-error">{error}</p>}

      <div className="flex items-center justify-between rounded-md border border-teal/40 bg-[#f7f7f7] px-4 py-3 text-xs">
        <span className="font-extrabold uppercase tracking-[0.14em] text-teal-deep">CS department · verified</span>
        <button type="button" onClick={() => setFromCs(null)} className="font-semibold text-ink/70 underline underline-offset-4 hover:text-ink">
          Change
        </button>
      </div>

      <Section step="01" title="About you">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <input required className="input-glass" value={form.proposerName} onChange={(e) => update("proposerName", e.target.value)} />
          </Field>
          <Field label="Email address">
            <input required type="email" className="input-glass" value={form.proposerEmail} onChange={(e) => update("proposerEmail", e.target.value)} />
          </Field>
          <Field label="Phone number">
            <input required type="tel" className="input-glass" value={form.proposerPhone} onChange={(e) => update("proposerPhone", e.target.value)} />
            <p className="mt-1.5 text-xs text-ink/70">
              Once your event is approved, your name and phone number appear on the public Contact page so participants can reach you. You can hide them later from your manage link.
            </p>
          </Field>
        </div>
      </Section>

      <Section step="02" title="The event">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Event name" className="sm:col-span-2">
            <input required className="input-glass" value={form.title} onChange={(e) => update("title", e.target.value)} />
          </Field>
          <Field label="Category">
            <select required className="input-glass" value={form.category} onChange={(e) => update("category", e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Description">
          <textarea required rows={4} className="input-glass" value={form.description} onChange={(e) => update("description", e.target.value)} />
        </Field>
        <Field label="Rules (optional)">
          <textarea rows={3} className="input-glass" value={form.rules} onChange={(e) => update("rules", e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Expected participants">
            <input required type="number" min={1} className="input-glass" value={form.expectedParticipants} onChange={(e) => update("expectedParticipants", e.target.value)} />
          </Field>
          <Field label="Maximum participants">
            <input required type="number" min={1} className="input-glass" value={form.maxParticipants} onChange={(e) => update("maxParticipants", e.target.value)} />
          </Field>
          <Field label="Approximate duration">
            <input placeholder="e.g. 2 hours" className="input-glass" value={form.duration} onChange={(e) => update("duration", e.target.value)} />
          </Field>
        </div>
      </Section>

      <Section step="03" title="Logistics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Venue">
            <input className="input-glass" value={form.venueRequirements} onChange={(e) => update("venueRequirements", e.target.value)} />
          </Field>
          <Field label="Equipment or resources">
            <input className="input-glass" value={form.equipmentRequirements} onChange={(e) => update("equipmentRequirements", e.target.value)} />
          </Field>
          <Field label="Preferred date">
            <input type="date" className="input-glass" value={form.preferredDate} onChange={(e) => update("preferredDate", e.target.value)} />
          </Field>
          <Field label="Preferred time">
            <input type="time" className="input-glass" value={form.preferredTime} onChange={(e) => update("preferredTime", e.target.value)} />
          </Field>
        </div>
        <Field label="Anything else">
          <textarea rows={3} className="input-glass" value={form.additionalInfo} onChange={(e) => update("additionalInfo", e.target.value)} />
        </Field>
      </Section>

      <button type="submit" disabled={submitting} className="btn btn-primary w-full !py-4 text-base">
        {submitting ? "Submitting…" : "Submit proposal"}
      </button>
    </form>
  );
}

function Section({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <section className="glass glass-sheen rounded-md p-6 sm:p-8">
      <div className="mb-6 flex items-baseline gap-3">
        <span className="font-display text-2xl text-ink/35">{step}</span>
        <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label: text, className = "", children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label className={label}>{text}</label>
      {children}
    </div>
  );
}
