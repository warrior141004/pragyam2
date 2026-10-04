"use client";

import { useEffect, useState, useCallback } from "react";

type Tab = "overview" | "proposals" | "registrations" | "manage";
type SubTab = "PENDING" | "APPROVED" | "REJECTED";

interface Proposal {
  _id: string;
  title: string;
  proposerName: string;
  proposerEmail: string;
  category: string;
  status: SubTab;
  createdAt: string;
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
  rejectionReason: string;
}

interface Registration {
  _id: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  teamRequired: boolean;
  teamMembers: { name: string; enrollmentNo: string }[];
  additionalNote: string;
  createdAt: string;
  event: { _id: string; title: string; maxParticipants: number } | null;
}

const badge: Record<string, string> = {
  PENDING: "badge badge-amber",
  APPROVED: "badge badge-emerald",
  REJECTED: "badge badge-rose",
};

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "proposals", label: "Proposals" },
  { key: "registrations", label: "Registrations" },
  { key: "manage", label: "Manage events" },
];

const row = "rounded-md border border-ink/10 bg-ink/5 p-4 transition-colors hover:bg-ink/5";
const meta = "text-xs text-ink/66";
const detailGrid = "mt-4 grid gap-2 border-t border-ink/10 pt-4 text-sm text-ink/75 sm:grid-cols-2";
const k = "text-ink/76";

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="chip">
            <i className="dot bg-current text-orange" />
            Organizers
          </span>
          <h1 className="font-display mt-4 text-3xl font-bold text-ink sm:text-4xl">
            Pragyam 2.0 <span className="font-display text-orange">dashboard</span>
          </h1>
        </div>
        <button
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            onLogout();
          }}
          className="btn btn-glass btn-sm"
        >
          Sign out
        </button>
      </div>

      <div className="glass-strong mt-8 inline-flex max-w-full flex-wrap gap-1 rounded-md p-1.5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors ${
              tab === t.key
                ? "bg-ink/5 text-ink"
                : "text-ink/76 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="glass glass-sheen mt-6 rounded-md p-5 sm:p-8">
        {tab === "overview" && <Overview />}
        {tab === "proposals" && <ProposalsPanel />}
        {tab === "registrations" && <RegistrationsPanel />}
        {tab === "manage" && <ManageEventsPanel />}
      </div>
    </div>
  );
}

function Overview() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((r) => (r.ok ? r.json() : null))
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const cards = [
    { key: "pendingProposals", label: "Pending proposals", tint: "tint-amber" },
    { key: "approvedEvents", label: "Approved events", tint: "tint-emerald" },
    { key: "totalRegistrations", label: "Total registrations", tint: "tint-cyan" },
    { key: "totalEvents", label: "All proposals", tint: "tint-violet" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.key} className={`glass glass-sheen ${c.tint} rounded-md p-6`}>
          <p className="font-display text-4xl font-bold text-ink">{stats ? stats[c.key] ?? 0 : "—"}</p>
          <p className="mt-2 text-xs text-ink/70">{c.label}</p>
        </div>
      ))}
    </div>
  );
}

function SubTabs({ value, onChange }: { value: SubTab; onChange: (v: SubTab) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {(["PENDING", "APPROVED", "REJECTED"] as SubTab[]).map((s) => (
        <button key={s} onClick={() => onChange(s)} className={`chip ${value === s ? "chip-active" : ""}`}>
          {s.charAt(0) + s.slice(1).toLowerCase()}
        </button>
      ))}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-sm text-ink/66">{children}</p>;
}

function ProposalsPanel() {
  const [status, setStatus] = useState<SubTab>("PENDING");
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/proposals?status=${status}`);
      const data = res.ok ? await res.json() : { proposals: [] };
      setProposals(data.proposals || []);
    } catch {
      setProposals([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount/status-change
    load();
  }, [load]);

  async function act(id: string, action: "approve" | "reject") {
    let rejectionReason = "";
    if (action === "reject") {
      rejectionReason = window.prompt("Reason for rejection (optional):") || "";
    }
    setBusy(id);
    try {
      await fetch(`/api/admin/proposals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, rejectionReason }),
      });
      await load();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <SubTabs value={status} onChange={setStatus} />
      <div className="mt-6 space-y-3">
        {loading ? (
          <Empty>Loading…</Empty>
        ) : proposals.length === 0 ? (
          <Empty>No proposals here.</Empty>
        ) : (
          proposals.map((p) => (
            <div key={p._id} className={row}>
              <div
                className="flex cursor-pointer flex-wrap items-center justify-between gap-3"
                onClick={() => setExpanded(expanded === p._id ? null : p._id)}
              >
                <div>
                  <p className="font-medium text-ink">{p.title}</p>
                  <p className={meta}>
                    {p.proposerName} · {p.category} · {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={badge[p.status]}>{p.status}</span>
                  {p.status === "PENDING" && (
                    <>
                      <button
                        disabled={busy === p._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          act(p._id, "approve");
                        }}
                        className="btn btn-success btn-sm"
                      >
                        Approve
                      </button>
                      <button
                        disabled={busy === p._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          act(p._id, "reject");
                        }}
                        className="btn btn-danger btn-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>

              {expanded === p._id && (
                <div className={detailGrid}>
                  <p><span className={k}>Email:</span> {p.proposerEmail}</p>
                  <p><span className={k}>Expected / Max:</span> {p.expectedParticipants} / {p.maxParticipants}</p>
                  <p><span className={k}>Duration:</span> {p.duration || "—"}</p>
                  <p><span className={k}>Venue:</span> {p.venueRequirements || "—"}</p>
                  <p><span className={k}>Equipment:</span> {p.equipmentRequirements || "—"}</p>
                  <p><span className={k}>Preferred:</span> {p.preferredDate || "—"} {p.preferredTime}</p>
                  <p className="sm:col-span-2"><span className={k}>Description:</span> {p.description}</p>
                  {p.rules && <p className="sm:col-span-2"><span className={k}>Rules:</span> {p.rules}</p>}
                  {p.additionalInfo && <p className="sm:col-span-2"><span className={k}>Additional info:</span> {p.additionalInfo}</p>}
                  {p.rejectionReason && <p className="sm:col-span-2"><span className={k}>Rejection reason:</span> {p.rejectionReason}</p>}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function RegistrationsPanel() {
  const [regs, setRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/registrations`);
      const data = res.ok ? await res.json() : { registrations: [] };
      setRegs(data.registrations || []);
    } catch {
      setRegs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount
    load();
  }, [load]);

  async function remove(id: string) {
    if (!window.confirm("Remove this registration entry?")) return;
    setBusy(id);
    try {
      await fetch(`/api/admin/registrations/${id}`, { method: "DELETE" });
      await load();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <p className="mb-5 max-w-2xl text-sm text-ink/70">
        Registrations are confirmed automatically while an event has space. The host is emailed for
        each new one.
      </p>
      <div className="space-y-3">
        {loading ? (
          <Empty>Loading…</Empty>
        ) : regs.length === 0 ? (
          <Empty>No registrations yet.</Empty>
        ) : (
          regs.map((r) => (
            <div key={r._id} className={row}>
              <div
                className="flex cursor-pointer flex-wrap items-center justify-between gap-3"
                onClick={() => setExpanded(expanded === r._id ? null : r._id)}
              >
                <div>
                  <p className="font-medium text-ink">{r.participantName}</p>
                  <p className={meta}>
                    {r.event?.title || "Unknown event"} · {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  disabled={busy === r._id}
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(r._id);
                  }}
                  className="btn btn-danger btn-sm"
                >
                  Remove
                </button>
              </div>

              {expanded === r._id && (
                <div className={detailGrid}>
                  <p><span className={k}>Email:</span> {r.participantEmail}</p>
                  <p><span className={k}>Phone:</span> {r.participantPhone}</p>
                  {r.teamRequired && r.teamMembers.length > 0 && (
                    <div className="sm:col-span-2">
                      <span className={k}>Team:</span>{" "}
                      {r.teamMembers.map((m) => `${m.name}${m.enrollmentNo ? ` (${m.enrollmentNo})` : ""}`).join(", ")}
                    </div>
                  )}
                  {r.additionalNote && (
                    <p className="sm:col-span-2"><span className={k}>Note:</span> {r.additionalNote}</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ManageEventsPanel() {
  const [events, setEvents] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Proposal>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/proposals?status=APPROVED`);
      const data = res.ok ? await res.json() : { proposals: [] };
      setEvents(data.proposals || []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount
    load();
  }, [load]);

  function startEdit(e: Proposal) {
    setEditing(e._id);
    setForm({
      venue: e.venue,
      maxParticipants: e.maxParticipants,
      preferredDate: e.preferredDate,
      preferredTime: e.preferredTime,
      duration: e.duration,
      registrationsClosed: e.registrationsClosed,
    });
  }

  async function saveEdit(id: string) {
    await fetch(`/api/admin/proposals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setEditing(null);
    await load();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete/cancel this event? This cannot be undone.")) return;
    await fetch(`/api/admin/proposals/${id}`, { method: "DELETE" });
    await load();
  }

  const lbl = "mb-1.5 block text-xs text-ink/70";

  return (
    <div className="space-y-3">
      {loading ? (
        <Empty>Loading…</Empty>
      ) : events.length === 0 ? (
        <Empty>No approved events yet.</Empty>
      ) : (
        events.map((e) => (
          <div key={e._id} className={row}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-ink">{e.title}</p>
                <p className={meta}>
                  {e.category}
                  {e.registrationsClosed ? " · registrations closed" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => (editing === e._id ? setEditing(null) : startEdit(e))}
                  className="btn btn-glass btn-sm"
                >
                  {editing === e._id ? "Cancel" : "Edit"}
                </button>
                <button onClick={() => remove(e._id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </div>
            </div>

            {editing === e._id && (
              <div className="mt-4 grid gap-3 border-t border-ink/10 pt-4 sm:grid-cols-2">
                <div>
                  <label className={lbl}>Venue</label>
                  <input className="input-glass" value={form.venue || ""} onChange={(ev) => setForm((f) => ({ ...f, venue: ev.target.value }))} />
                </div>
                <div>
                  <label className={lbl}>Max participants</label>
                  <input type="number" min={1} className="input-glass" value={form.maxParticipants ?? ""} onChange={(ev) => setForm((f) => ({ ...f, maxParticipants: Number(ev.target.value) }))} />
                </div>
                <div>
                  <label className={lbl}>Date</label>
                  <input type="date" className="input-glass" value={form.preferredDate || ""} onChange={(ev) => setForm((f) => ({ ...f, preferredDate: ev.target.value }))} />
                </div>
                <div>
                  <label className={lbl}>Time</label>
                  <input type="time" className="input-glass" value={form.preferredTime || ""} onChange={(ev) => setForm((f) => ({ ...f, preferredTime: ev.target.value }))} />
                </div>
                <div>
                  <label className={lbl}>Duration</label>
                  <input className="input-glass" value={form.duration || ""} onChange={(ev) => setForm((f) => ({ ...f, duration: ev.target.value }))} />
                </div>
                <label className="flex items-center justify-between rounded-md border border-ink/10 bg-ink/5 px-4 py-3 text-sm text-ink/80 self-end">
                  <span>Close registrations</span>
                  <input
                    type="checkbox"
                    checked={Boolean(form.registrationsClosed)}
                    onChange={(ev) => setForm((f) => ({ ...f, registrationsClosed: ev.target.checked }))}
                  />
                </label>
                <div className="sm:col-span-2">
                  <button onClick={() => saveEdit(e._id)} className="btn btn-primary btn-sm">
                    Save changes
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
