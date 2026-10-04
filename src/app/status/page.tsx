"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";

type ProposalStatus = { _id: string; title: string; status: string; rejectionReason: string; createdAt: string };
type RegStatus = { _id: string; eventTitle: string; status?: string; createdAt: string };

const badge: Record<string, string> = {
  PENDING: "badge badge-amber",
  APPROVED: "badge badge-emerald",
  CONFIRMED: "badge badge-emerald",
  REJECTED: "badge badge-rose",
};

export default function StatusPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [proposals, setProposals] = useState<ProposalStatus[]>([]);
  const [registrations, setRegistrations] = useState<RegStatus[]>([]);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/status?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setProposals(data.proposals || []);
      setRegistrations(data.registrations || []);
      setSearched(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10">
      <PageHeader
        eyebrow="Check status"
        tone="amber"
        title={
          <>
            Your <span className="font-display text-orange">submissions</span>
          </>
        }
        lede="Enter the email you used when proposing or registering and we'll show where things stand."
      />

      <form onSubmit={handleSubmit} className="glass-strong glass-sheen mt-10 flex flex-col gap-2 rounded-md p-2 sm:flex-row">
        <input
          required
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-glass flex-1 !rounded-md !border-transparent !bg-transparent !shadow-none focus:!bg-ink/5"
        />
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Checking…" : "Check status"}
        </button>
      </form>

      {error && <p className="alert-error mt-4">{error}</p>}

      {searched && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Group title="Proposals" empty="No proposals found for this email.">
            {proposals.map((p) => (
              <Item key={p._id} title={p.title} status={p.status} note={p.status === "REJECTED" ? p.rejectionReason : ""} />
            ))}
          </Group>
          <Group title="Registrations" empty="No registrations found for this email.">
            {registrations.map((r) => (
              <Item key={r._id} title={r.eventTitle} status={r.status || "CONFIRMED"} />
            ))}
          </Group>
        </div>
      )}
    </div>
  );
}

function Group({ title, empty, children }: { title: string; empty: string; children: React.ReactNode[] }) {
  return (
    <section className="glass glass-sheen animate-fade-up rounded-md p-6">
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-4 space-y-3">
        {children.length === 0 ? <p className="text-sm text-ink/70">{empty}</p> : children}
      </div>
    </section>
  );
}

function Item({ title, status, note }: { title: string; status: string; note?: string }) {
  return (
    <div className="rounded-md border border-ink/10 bg-ink/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium text-ink">{title}</p>
        <span className={badge[status] || "badge badge-emerald"}>{status}</span>
      </div>
      {note && <p className="mt-2 text-xs text-ink/70">Reason: {note}</p>}
    </div>
  );
}
