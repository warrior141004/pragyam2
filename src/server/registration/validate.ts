import { randomBytes } from "crypto";
import {
  LIMITS,
  QUESTION_TYPES,
  type QuestionType,
  type RegistrationAnswer,
  type RegistrationQuestion,
} from "@/config/registration";

type Result<T> = { value: T; error?: undefined } | { error: string; value?: undefined };

const str = (v: unknown) => String(v ?? "").trim();

/** Cleans the host's question list. Ids are kept if well-formed, otherwise generated. */
export function validateQuestions(raw: unknown): Result<RegistrationQuestion[]> {
  if (!Array.isArray(raw)) return { error: "Questions must be a list" };
  if (raw.length > LIMITS.questions) return { error: `You can add at most ${LIMITS.questions} questions` };

  const seen = new Set<string>();
  const out: RegistrationQuestion[] = [];

  for (const q of raw) {
    const label = str(q?.label);
    if (!label) return { error: "Every question needs some text" };
    if (label.length > LIMITS.label) return { error: `Question text is too long (max ${LIMITS.label} characters)` };

    const type = str(q?.type) as QuestionType;
    if (!QUESTION_TYPES.includes(type)) return { error: "Invalid question type" };

    let options: string[] = [];
    if (type === "select" || type === "checkbox") {
      options = Array.isArray(q?.options) ? q.options.map(str).filter(Boolean) : [];
      options = [...new Set(options)];
      if (options.length < 2) return { error: `"${label}" needs at least two options` };
      if (options.length > LIMITS.options || options.some((o) => o.length > LIMITS.option)) {
        return { error: `"${label}" has too many or too long options` };
      }
    }

    let id = str(q?.id);
    if (!/^[a-z0-9_-]{1,40}$/i.test(id) || seen.has(id)) id = randomBytes(5).toString("hex");
    seen.add(id);

    out.push({ id, label, type, required: Boolean(q?.required), options });
  }
  return { value: out };
}

/** Checks a participant's answers against the event's questions. Returns them with the question text frozen in. */
export function validateAnswers(questions: RegistrationQuestion[], raw: unknown): Result<RegistrationAnswer[]> {
  const given: Record<string, unknown> =
    raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const out: RegistrationAnswer[] = [];

  for (const q of questions) {
    const input = given[q.id];
    let value = "";

    if (q.type === "checkbox") {
      const picked = Array.isArray(input) ? input.map(str).filter(Boolean) : [];
      if (picked.some((p) => !q.options.includes(p))) return { error: `Invalid choice for "${q.label}"` };
      value = [...new Set(picked)].join(", ");
    } else {
      value = str(input);
      if (value.length > LIMITS.answer) return { error: `Answer to "${q.label}" is too long` };
      if (value) {
        if (q.type === "select" && !q.options.includes(value)) return { error: `Invalid choice for "${q.label}"` };
        if (q.type === "yesno" && value !== "Yes" && value !== "No") return { error: `Answer "${q.label}" with Yes or No` };
        if (q.type === "number" && !Number.isFinite(Number(value))) return { error: `"${q.label}" must be a number` };
        if (q.type === "link") {
          try {
            const u = new URL(value);
            if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error();
          } catch {
            return { error: `"${q.label}" must be a valid link starting with http:// or https://` };
          }
        }
      }
    }

    if (!value) {
      if (q.required) return { error: `Please answer: ${q.label}` };
      continue;
    }
    out.push({ questionId: q.id, label: q.label, value });
  }
  return { value: out };
}
