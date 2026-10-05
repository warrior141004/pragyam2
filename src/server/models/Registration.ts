import mongoose, { Schema, models, model } from "mongoose";
import type { RegistrationAnswer } from "@/config/registration";

export interface ITeamMember {
  name: string;
  enrollmentNo: string;
}

export interface IRegistration {
  _id: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  enrollmentNo?: string;
  department?: string;
  year?: string;
  teamName?: string;
  answers: RegistrationAnswer[];
  teamRequired: boolean;
  teamMembers: ITeamMember[];
  additionalNote: string;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    event: { type: Schema.Types.ObjectId, ref: "EventProposal", required: true },
    participantName: { type: String, required: true, trim: true },
    participantEmail: { type: String, required: true, trim: true, lowercase: true },
    participantPhone: { type: String, required: true, trim: true },
    // Optional at schema level so registrations made before these fields existed stay valid; the API requires them.
    enrollmentNo: { type: String, trim: true, uppercase: true },
    department: { type: String, trim: true },
    year: { type: String, trim: true },
    teamName: { type: String, trim: true },
    answers: {
      type: [{ _id: false, questionId: String, label: String, value: String }],
      default: [],
    },
    teamRequired: { type: Boolean, default: false },
    teamMembers: {
      type: [
        {
          name: { type: String, trim: true },
          enrollmentNo: { type: String, trim: true },
        },
      ],
      default: [],
    },
    additionalNote: { type: String, default: "" },
  },
  { timestamps: true }
);

// One registration per enrollment number per event (only for registrations that have one)
RegistrationSchema.index(
  { event: 1, enrollmentNo: 1 },
  { unique: true, partialFilterExpression: { enrollmentNo: { $type: "string" } } }
);

// Prevent duplicate registrations for the same email + event
RegistrationSchema.index({ event: 1, participantEmail: 1 }, { unique: true });

export default models.Registration ||
  model<IRegistration>("Registration", RegistrationSchema);
