"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";

interface Contact {
  eventId: string;
  eventTitle: string;
  category: string;
  hostName: string;
  hostPhone: string;
}

export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/contacts")
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data = await res.json();
        setContacts(data.contacts || []);
      })
      .catch(() => setError("Could not load contacts. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const q = search.trim().toLowerCase();
  const shown = q
    ? contacts.filter((c) => `${c.eventTitle} ${c.hostName}`.toLowerCase().includes(q))
    : contacts;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Reach the <span className="font-display text-orange">hosts</span>
          </>
        }
        lede="Questions about an event? Call the student who is hosting it."
      />

      <div className="glass glass-sheen mt-10 rounded-md p-4">
        <input
          type="text"
          placeholder="Search by event or host name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-glass !rounded-md"
        />
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass h-36 animate-pulse rounded-md" />
            ))}
          </div>
        ) : error ? (
          <p className="alert-error">{error}</p>
        ) : shown.length === 0 ? (
          <div className="glass glass-sheen rounded-md p-10 text-center">
            <p className="font-display text-xl font-semibold text-ink">No contacts yet</p>
            <p className="mt-2 text-sm text-ink/76">Host details appear here once events are approved.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((c) => (
              <div key={c.eventId} className="glass glass-sheen rounded-md p-6">
                <span className="chip">{c.category}</span>
                <Link href={`/events/${c.eventId}`} className="font-display mt-3 block text-xl font-semibold text-ink hover:text-orange">
                  {c.eventTitle}
                </Link>
                <p className="mt-3 text-sm text-ink/70">
                  Host: <span className="font-medium text-ink">{c.hostName}</span>
                </p>
                <a href={`tel:${c.hostPhone.replace(/[^\d+]/g, "")}`} className="mt-1 inline-block text-sm font-semibold text-orange underline underline-offset-4">
                  {c.hostPhone}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
