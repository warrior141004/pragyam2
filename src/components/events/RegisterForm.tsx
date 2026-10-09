"use client";

import { useState } from "react";
import { YEARS, type RegistrationQuestion } from "@/config/registration";

type TeamMember = { name: string; enrollmentNo: string };
type AnswerValue = string | string[];

const labelClass = "mb-1.5 block text-xs font-medium text-ink/76";

export default function RegisterForm({
  eventId,
  questions = [],
  teamMinSize = 1,
  teamMaxSize = 1,
  onDone,
}: {
  eventId: string;
  questions?: RegistrationQuestion[];
  teamMinSize?: number;
  teamMaxSize?: number;
  onDone: () => void;
}) {
  const teamEvent = teamMaxSize > 1;
  const teamForced = teamEvent && teamMinSize > 1;
  // Team size counts the registrant, so a team has at least two people.
  const lowest = Math.max(teamMinSize, 2);

  const [form, setForm] = useState({
    participantName: "",
    participantEmail: "",
    participantPhone: "",
    enrollmentNo: "",
    department: "",
    year: "",
  });
  const [teamRequired, setTeamRequired] = useState(teamForced);
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState(lowest);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    Array.from({ length: lowest - 1 }, () => ({ name: "", enrollmentNo: "" }))
  );
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [additionalNote, setAdditionalNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateTeamSize(size: number) {
    const clamped = Math.min(Math.max(size || lowest, lowest), teamMaxSize);
    setTeamSize(clamped);
    setTeamMembers((prev) => {
      const next = [...prev];
      while (next.length < clamped - 1) next.push({ name: "", enrollmentNo: "" });
      return next.slice(0, clamped - 1);
    });
  }

  function updateTeamMember(index: number, field: keyof TeamMember, value: string) {
    setTeamMembers((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  }

  function setAnswer(id: string, value: AnswerValue) {
    setAnswers((a) => ({ ...a, [id]: value }));
  }

  function toggleCheckbox(q: RegistrationQuestion, option: string) {
    const current = (answers[q.id] as string[] | undefined) ?? [];
    setAnswer(q.id, current.includes(option) ? current.filter((o) => o !== option) : [...current, option]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Checkbox groups can't use the browser's "required", so check them here.
    for (const q of questions) {
      if (q.type === "checkbox" && q.required && !((answers[q.id] as string[] | undefined)?.length)) {
        setError(`Please answer: ${q.label}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          ...form,
          teamRequired,
          teamName: teamRequired ? teamName : "",
          teamMembers: teamRequired ? teamMembers : [],
          answers,
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
        <input required value={form.participantName} onChange={(e) => update("participantName", e.target.value)} className="input-glass" />
      </div>
      <div>
        <label className={labelClass}>Email address</label>
        <input required type="email" value={form.participantEmail} onChange={(e) => update("participantEmail", e.target.value)} className="input-glass" />
      </div>
      <div>
        <label className={labelClass}>Phone number</label>
        <input required type="tel" value={form.participantPhone} onChange={(e) => update("participantPhone", e.target.value)} className="input-glass" />
      </div>
      <div>
        <label className={labelClass}>Enrollment number</label>
        <input required value={form.enrollmentNo} onChange={(e) => update("enrollmentNo", e.target.value)} className="input-glass" />
      </div>
      <div>
        <label className={labelClass}>Department / Course</label>
        <input required placeholder="e.g. Computer Science, B.Tech" value={form.department} onChange={(e) => update("department", e.target.value)} className="input-glass" />
      </div>
      <div>
        <label className={labelClass}>Year</label>
        <select required value={form.year} onChange={(e) => update("year", e.target.value)} className="input-glass">
          <option value="">Select year</option>
          {YEARS.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      {teamEvent && (
        <>
          {teamForced ? (
            <p className="rounded-md border border-ink/10 bg-ink/5 px-4 py-3 text-sm text-ink/80">
              This is a team event: {teamMinSize}–{teamMaxSize} members including you.
            </p>
          ) : (
            <label className="flex cursor-pointer items-center justify-between rounded-md border border-ink/10 bg-ink/5 px-4 py-3 text-sm text-ink/80">
              <span>Registering as a team (up to {teamMaxSize} members)</span>
              <input type="checkbox" checked={teamRequired} onChange={(e) => setTeamRequired(e.target.checked)} />
            </label>
          )}

          {teamRequired && (
            <div className="space-y-3 rounded-md border border-ink/10 bg-ink/5 p-4">
              <div>
                <label className={labelClass}>Team name</label>
                <input required value={teamName} onChange={(e) => setTeamName(e.target.value)} className="input-glass" />
              </div>
              <div>
                <label className={labelClass}>Team size (including you)</label>
                <input type="number" min={lowest} max={teamMaxSize} value={teamSize} onChange={(e) => updateTeamSize(Number(e.target.value))} className="input-glass" />
              </div>
              {teamMembers.map((member, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-2">
                  <input required placeholder={`Member ${i + 2} name`} value={member.name} onChange={(e) => updateTeamMember(i, "name", e.target.value)} className="input-glass" />
                  <input required placeholder="Enrollment no." value={member.enrollmentNo} onChange={(e) => updateTeamMember(i, "enrollmentNo", e.target.value)} className="input-glass" />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {questions.length > 0 && (
        <div className="space-y-4 border-t border-ink/10 pt-4">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-orange">Questions from the host</p>
          {questions.map((q) => (
            <div key={q.id}>
              <label className={labelClass}>
                {q.label}
                {q.required ? <span className="text-orange"> *</span> : <span className="text-ink/70"> (optional)</span>}
              </label>

              {q.type === "textarea" ? (
                <textarea required={q.required} rows={3} className="input-glass" value={(answers[q.id] as string) ?? ""} onChange={(e) => setAnswer(q.id, e.target.value)} />
              ) : q.type === "select" ? (
                <select required={q.required} className="input-glass" value={(answers[q.id] as string) ?? ""} onChange={(e) => setAnswer(q.id, e.target.value)}>
                  <option value="">Select…</option>
                  {q.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : q.type === "yesno" ? (
                <select required={q.required} className="input-glass" value={(answers[q.id] as string) ?? ""} onChange={(e) => setAnswer(q.id, e.target.value)}>
                  <option value="">Select…</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              ) : q.type === "checkbox" ? (
                <div className="space-y-2">
                  {q.options.map((o) => (
                    <label key={o} className="flex items-center gap-2 text-sm text-ink/80">
                      <input type="checkbox" checked={((answers[q.id] as string[] | undefined) ?? []).includes(o)} onChange={() => toggleCheckbox(q, o)} />
                      {o}
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  required={q.required}
                  type={q.type === "number" ? "number" : q.type === "link" ? "url" : "text"}
                  placeholder={q.type === "link" ? "https://" : undefined}
                  className="input-glass"
                  value={(answers[q.id] as string) ?? ""}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div>
        <label className={labelClass}>Anything the host should know (optional)</label>
        <textarea rows={3} value={additionalNote} onChange={(e) => setAdditionalNote(e.target.value)} className="input-glass" />
      </div>

      <button type="submit" disabled={submitting} className="btn btn-primary w-full">
        {submitting ? "Submitting…" : "Confirm registration"}
      </button>
    </form>
  );
}
