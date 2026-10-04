import mongoose, { Schema, models, model } from "mongoose";

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

// Prevent duplicate registrations for the same email + event
RegistrationSchema.index({ event: 1, participantEmail: 1 }, { unique: true });

export default models.Registration ||
  model<IRegistration>("Registration", RegistrationSchema);
