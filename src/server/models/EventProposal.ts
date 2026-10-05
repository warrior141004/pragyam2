import mongoose, { Schema, models, model } from "mongoose";

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
  createdAt: Date;
  updatedAt: Date;
}

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
    // SHA-256 of the host's private manage key; never returned by default.
    manageKeyHash: { type: String, default: "", select: false },
  },
  { timestamps: true }
);

export default models.EventProposal ||
  model<IEventProposal>("EventProposal", EventProposalSchema);
