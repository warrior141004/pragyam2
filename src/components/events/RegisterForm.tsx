"use client";

import { useState } from "react";

type TeamMember = { name: string; enrollmentNo: string };

const labelClass = "mb-1.5 block text-xs font-medium text-ink/76";

export default function RegisterForm({
  eventId,
  onDone,
}: {
  eventId: string;
  onDone: () => void;
}) {
  const [form, setForm] = useState({
    participantName: "",
    participantEmail: "",
    participantPhone: "",
  });
  const [teamRequired, setTeamRequired] = useState(false);
  const [teamSize, setTeamSize] = useState(1);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ name: "", enrollmentNo: "" }]);
  const [additionalNote, setAdditionalNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateTeamSize(size: number) {
    const clamped = Math.min(Math.max(size, 1), 20);
    setTeamSize(clamped);
    setTeamMembers((prev) => {
      const next = [...prev];
      while (next.length < clamped) next.push({ name: "", enrollmentNo: "" });
      return next.slice(0, clamped);
    });
  }

  function updateTeamMember(index: number, field: keyof TeamMember, value: string) {
    setTeamMembers((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          ...form,
          teamRequired,
          teamMembers: teamRequired ? teamMembers : [],
          additionalNote,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="alert-error">{error}</p>}
      <div>
        <label className={labelClass}>Full name</label>
        <input
          required
          value={form.participantName}
          onChange={(e) => update("participantName", e.target.value)}
          className="input-glass"
        />
      </div>
      <div>
        <label className={labelClass}>Email address</label>
        <input
          required
          type="email"
          value={form.participantEmail}
          onChange={(e) => update("participantEmail", e.target.value)}
          className="input-glass"
        />
      </div>
      <div>
        <label className={labelClass}>Phone number</label>
        <input
          required
          type="tel"
          value={form.participantPhone}
          onChange={(e) => update("participantPhone", e.target.value)}
          className="input-glass"
        />
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-md border border-ink/10 bg-ink/5 px-4 py-3 text-sm text-ink/80">
        <span>Registering as a team</span>
        <input
          type="checkbox"
          checked={teamRequired}
          onChange={(e) => setTeamRequired(e.target.checked)}
        />
      </label>

      {teamRequired && (
        <div className="space-y-3 rounded-md border border-ink/10 bg-ink/5 p-4">
          <div>
            <label className={labelClass}>Team size</label>
            <input
              type="number"
              min={1}
              max={20}
              value={teamSize}
              onChange={(e) => updateTeamSize(Number(e.target.value))}
              className="input-glass"
            />
          </div>
          {teamMembers.map((member, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-2">
              <input
                placeholder={`Member ${i + 1} name`}
                value={member.name}
                onChange={(e) => updateTeamMember(i, "name", e.target.value)}
                className="input-glass"
              />
              <input
                placeholder="Enrollment no."
                value={member.enrollmentNo}
                onChange={(e) => updateTeamMember(i, "enrollmentNo", e.target.value)}
                className="input-glass"
              />
            </div>
          ))}
        </div>
      )}

      <div>
        <label className={labelClass}>Anything the host should know (optional)</label>
        <textarea
          rows={3}
          value={additionalNote}
          onChange={(e) => setAdditionalNote(e.target.value)}
          className="input-glass"
        />
      </div>

      <button type="submit" disabled={submitting} className="btn btn-primary w-full">
        {submitting ? "Submitting…" : "Confirm registration"}
      </button>
    </form>
  );
}
