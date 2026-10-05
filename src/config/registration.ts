/** Shared by the browser forms and the API validators, so the two can't drift apart. */

export const QUESTION_TYPES = ["text", "textarea", "number", "select", "checkbox", "yesno", "link"] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  text: "Short answer",
  textarea: "Long answer",
  number: "Number",
  select: "Dropdown (pick one)",
  checkbox: "Checkboxes (pick many)",
  yesno: "Yes / No",
  link: "Link (URL)",
};

export interface RegistrationQuestion {
  id: string;
  label: string;
  type: QuestionType;
  required: boolean;
  options: string[];
}

export interface RegistrationAnswer {
  questionId: string;
  label: string;
  value: string;
}

export const YEARS = ["1st year", "2nd year", "3rd year", "4th year", "5th year", "Other"] as const;

export const LIMITS = {
  questions: 20,
  label: 200,
  options: 20,
  option: 100,
  answer: 1000,
  maxTeam: 20,
};

export const ENROLLMENT_RE = /^[A-Za-z0-9/_-]{4,30}$/;
