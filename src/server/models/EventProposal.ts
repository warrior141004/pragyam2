import mongoose, { Schema, models, model } from "mongoose";
import type { RegistrationQuestion } from "@/config/registration";

export const CATEGORIES = [
  "Technical",
  "Gaming",
  "Creative",
  "Cultural",
  "Quiz",
  "Competition",
  "Fun Activity",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type ProposalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IEventProposal {
  _id: mongoose.Types.ObjectId;
  proposerName: string;
  proposerEmail: string;
  proposerPhone: string;
  title: string;
  category: Category;
  description: string;
  rules: string;
  expectedParticipants: number;
  maxParticipants: number;
  duration: string;
  venueRequirements: string;
  equipmentRequirements: string;
  preferredDate: string;
  preferredTime: string;
  additionalInfo: string;
  status: ProposalStatus;
  rejectionReason: string;
  venue: string;
  registrationsClosed: boolean;
  manageKeyHash: string;
  registrationQuestions: RegistrationQuestion[];
  /** Team size includes the registrant. Max 1 means an individual event. */
  teamMinSize: number;
  teamMaxSize: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true },
    required: { type: Boolean, default: false },
    options: { type: [String], default: [] },
  },
  { _id: false }
);

const EventProposalSchema = new Schema<IEventProposal>(
  {
    proposerName: { type: String, required: true, trim: true },
    proposerEmail: { type: String, required: true, trim: true, lowercase: true },
    proposerPhone: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: CATEGORIES, required: true },
    description: { type: String, required: true },
    rules: { type: String, default: "" },
    expectedParticipants: { type: Number, required: true, min: 1 },
    maxParticipants: { type: Number, required: true, min: 1 },
    duration: { type: String, default: "" },
    venueRequirements: { type: String, default: "" },
    equipmentRequirements: { type: String, default: "" },
    preferredDate: { type: String, default: "" },
    preferredTime: { type: String, default: "" },
    additionalInfo: { type: String, default: "" },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    rejectionReason: { type: String, default: "" },
    venue: { type: String, default: "" },
    registrationsClosed: { type: Boolean, default: false },
    registrationQuestions: { type: [QuestionSchema], default: [] },
    teamMinSize: { type: Number, default: 1, min: 1 },
    teamMaxSize: { type: Number, default: 1, min: 1 },
    // SHA-256 of the host's private manage key; never returned by default.
    manageKeyHash: { type: String, default: "", select: false },
  },
  { timestamps: true }
);

export default models.EventProposal ||
  model<IEventProposal>("EventProposal", EventProposalSchema);
