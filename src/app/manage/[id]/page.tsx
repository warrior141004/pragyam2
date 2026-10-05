"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const CATEGORIES = ["Technical", "Gaming", "Creative", "Cultural", "Quiz", "Competition", "Fun Activity", "Other"];

interface HostEvent {
  _id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  proposerName: string;
  proposerEmail: string;
  proposerPhone: string;
  title: string;
  category: string;
  description: string;
  rules: string;
  expectedParticipants: number;
  maxParticipants: number;
  duration: string;
  venue: string;
  venueRequirements: string;
  equipmentRequirements: string;
  preferredDate: string;
  preferredTime: string;
  additionalInfo: string;
  registrationsClosed: boolean;
}

interface Participant {
  _id: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  teamMembers: { name: string; enrollmentNo: string }[];
  additionalNote: string;
  createdAt: string;
}

const lbl = "mb-1.5 block text-xs font-medium text-ink/76";

export default function ManagePage() {
  const { id } = useParams<{ id: string }>();
  const [key, setKey] = useState<string | null>(null);
  const [event, setEvent] = useState<HostEvent | null>(null);
  const [form, setForm] = useState<HostEvent | null>(null);
  const [people, setPeople] = useState<Participant[]>([]);
  const [state, setState] = useState<"loading" | "denied" | "ready">("loading");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Take the key from the emailed link, keep it for this tab only, and remove it from the address bar.
  useEffect(() => {
    const storeKey = `pragyam_manage_${id}`;
    const fromUrl = new URLSearchParams(window.location.search).get("key");
    let k: string | null = null;
    try {
      if (fromUrl) sessionStorage.setItem(storeKey, fromUrl);
      k = fromUrl || sessionStorage.getItem(storeKey);
    } catch {
      k = fromUrl;
    }
    if (fromUrl) window.history.replaceState(null, "", window.location.pathname);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read-once on mount
    setKey(k);
    if (!k) setState("denied");
  }, [id]);

  const load = useCallback(async () => {
    if (!key) return;
    const res = await fetch(`/api/host/events/${id}`, { headers: { "x-manage-key": key }, cache: "no-store" });
    if (!res.ok) {
      setState("denied");
      return;
    }
    const data = await res.json();
    setEvent(data.event);
    setForm(data.event);
    setPeople(data.registrations);
    setState("ready");
  }, [id, key]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch once the key is known
    load();
  }, [load]);

  function set<K extends keyof HostEvent>(field: K, value: HostEvent[K]) {
    setForm((f) => (f ? { ...f, [field]: value } : f));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form || !key) return;
    setSaving(true);
    setMsg(null);
    const { proposerName, proposerEmail, proposerPhone, title, category, description, rules, expectedParticipants, maxParticipants, duration, venueRequirements, equipmentRequirements, preferredDate, preferredTime, additionalInfo, registrationsClosed } = form;
    const res = await fetch(`/api/host/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-manage-key": key },
      body: JSON.stringify({ proposerName, proposerEmail, proposerPhone, title, category, description, rules, expectedParticipants: Number(expectedParticipants), maxParticipants: Number(maxParticipants), duration, venueRequirements, equipmentRequirements, preferredDate, preferredTime, additionalInfo, registrationsClosed }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setMsg({ ok: false, text: data.error || "Could not save changes." });
      return;
    }
    setMsg({ ok: true, text: "Changes saved." });
    await load();
  }

  async function removePerson(p: Participant) {
    if (!key || !window.confirm(`Remove ${p.participantName} from this event?`)) return;
    const res = await fetch(`/api/host/events/${id}/registrations/${p._id}`, { method: "DELETE", headers: { "x-manage-key": key } });
    if (res.ok) await load();
    else setMsg({ ok: false, text: "Could not remove that participant." });
  }

  function exportCsv() {
    const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = [
      ["Name", "Email", "Phone", "Team members", "Note", "Registered"],
      ...people.map((p) => [
        p.participantName,
        p.participantEmail,
        p.participantPhone,
        p.teamMembers.map((m) => (m.enrollmentNo ? `${m.name} (${m.enrollmentNo})` : m.name)).join("; "),
        p.additionalNote,
        new Date(p.createdAt).toLocaleString(),
      ]),
    ];
    // Prefix risky leading characters so spreadsheets don't treat participant text as formulas.
    const safe = (v: string) => (/^[=+\-@\t\r]/.test(v) ? `'${v}` : v);
    const csv = rows.map((r) => r.map((v) => cell(safe(v))).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event?.title ?? "participants"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (state === "loading") {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-ink/70">Loading…</div>;
  }

  if (state === "denied" || !event || !form) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="glass-strong rounded-md p-8">
          <h1 className="font-display text-2xl text-ink">Manage link needed</h1>
          <p className="mt-3 text-sm text-ink/70">
            Only the host can open this page, using the private link emailed when the event was submitted. If you lost it,
            contact the organizers to have a new one sent.
          </p>
          <Link href="/" className="btn btn-glass mt-6">Back home</Link>
        </div>
      </div>
    );
  }

  const statusLabel = { PENDING: "Awaiting approval", APPROVED: "Live", REJECTED: "Rejected" }[event.status];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-28">
      <div className="flex flex-wrap items-center gap-3">
        <span className="chip chip-active">{statusLabel}</span>
        {event.status === "APPROVED" && (
          <Link href={`/events/${event._id}`} className="text-sm font-semibold text-orange underline underline-offset-4">
            View public page
          </Link>
        )}
      </div>
      <h1 className="font-display mt-4 text-3xl font-bold text-ink sm:text-4xl">Manage: {event.title}</h1>

      {msg && <p className={`mt-4 ${msg.ok ? "rounded-md border border-teal/40 bg-teal/10 px-4 py-3 text-sm text-teal" : "alert-error"}`}>{msg.text}</p>}

      <form onSubmit={save} className="glass glass-sheen mt-8 space-y-4 rounded-md p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-ink">Event details</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className={lbl}>Event name</label>
            <input required className="input-glass" value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Category</label>
            <select className="input-glass" value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={lbl}>Description</label>
          <textarea required rows={4} className="input-glass" value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div>
          <label className={lbl}>Rules</label>
          <textarea rows={3} className="input-glass" value={form.rules} onChange={(e) => set("rules", e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={lbl}>Expected participants</label>
            <input required type="number" min={1} className="input-glass" value={form.expectedParticipants} onChange={(e) => set("expectedParticipants", Number(e.target.value))} />
          </div>
          <div>
            <label className={lbl}>Maximum participants</label>
            <input required type="number" min={Math.max(1, people.length)} className="input-glass" value={form.maxParticipants} onChange={(e) => set("maxParticipants", Number(e.target.value))} />
          </div>
          <div>
            <label className={lbl}>Duration</label>
            <input className="input-glass" value={form.duration} onChange={(e) => set("duration", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Preferred date</label>
            <input type="date" className="input-glass" value={form.preferredDate} onChange={(e) => set("preferredDate", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Preferred time</label>
            <input type="time" className="input-glass" value={form.preferredTime} onChange={(e) => set("preferredTime", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Venue (set by organizers)</label>
            <input disabled className="input-glass" value={form.venue || "Not assigned yet"} readOnly />
          </div>
          <div>
            <label className={lbl}>Venue requirements</label>
            <input className="input-glass" value={form.venueRequirements} onChange={(e) => set("venueRequirements", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={lbl}>Equipment or resources</label>
            <input className="input-glass" value={form.equipmentRequirements} onChange={(e) => set("equipmentRequirements", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={lbl}>Anything else</label>
          <textarea rows={3} className="input-glass" value={form.additionalInfo} onChange={(e) => set("additionalInfo", e.target.value)} />
        </div>

        <h2 className="font-display pt-2 text-xl font-semibold text-ink">Your contact details</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={lbl}>Full name</label>
            <input required className="input-glass" value={form.proposerName} onChange={(e) => set("proposerName", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Email</label>
            <input required type="email" className="input-glass" value={form.proposerEmail} onChange={(e) => set("proposerEmail", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Phone</label>
            <input required type="tel" className="input-glass" value={form.proposerPhone} onChange={(e) => set("proposerPhone", e.target.value)} />
          </div>
        </div>

        <label className="flex items-center gap-3 pt-2 text-sm text-ink/80">
          <input type="checkbox" checked={form.registrationsClosed} onChange={(e) => set("registrationsClosed", e.target.checked)} />
          Close registrations
        </label>

        <button type="submit" disabled={saving} className="btn btn-primary w-full !py-3">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      <section className="glass glass-sheen mt-8 rounded-md p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-ink">
            Participants <span className="text-ink/60">({people.length} / {event.maxParticipants})</span>
          </h2>
          <button onClick={exportCsv} disabled={people.length === 0} className="btn btn-glass btn-sm">
            Download CSV
          </button>
        </div>

        {people.length === 0 ? (
          <p className="mt-4 text-sm text-ink/70">No one has registered yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {people.map((p) => (
              <div key={p._id} className="rounded-md border border-ink/10 bg-white/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{p.participantName}</p>
                    <p className="break-all text-sm text-ink/70">{p.participantEmail} · {p.participantPhone}</p>
                    {p.teamMembers.length > 0 && (
                      <p className="mt-1 text-sm text-ink/70">
                        Team: {p.teamMembers.map((m) => (m.enrollmentNo ? `${m.name} (${m.enrollmentNo})` : m.name)).join(", ")}
                      </p>
                    )}
                    {p.additionalNote && <p className="mt-1 text-sm text-ink/70">Note: {p.additionalNote}</p>}
                  </div>
                  <button onClick={() => removePerson(p)} className="btn btn-danger btn-sm">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
