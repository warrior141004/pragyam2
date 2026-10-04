export type Category =
  | "Technical"
  | "Gaming"
  | "Creative"
  | "Cultural"
  | "Quiz"
  | "Competition"
  | "Fun Activity"
  | "Other";

export type Status = "PENDING" | "APPROVED" | "REJECTED";

export interface EventDTO {
  _id: string;
  title: string;
  category: Category;
  description: string;
  rules: string;
  proposerName: string;
  proposerEmail?: string;
  maxParticipants: number;
  approvedCount: number;
  duration: string;
  venue: string;
  venueRequirements: string;
  preferredDate: string;
  preferredTime: string;
  registrationsClosed: boolean;
  status: Status;
  createdAt: string;
}

export interface ProposalDTO extends EventDTO {
  equipmentRequirements: string;
  proposerEmail: string;
  proposerPhone: string;
  expectedParticipants: number;
  additionalInfo: string;
  rejectionReason: string;
}

export interface RegistrationDTO {
  _id: string;
  event: { _id: string; title: string } | string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  teamRequired: boolean;
  teamMembers: { name: string; enrollmentNo: string }[];
  additionalNote: string;
  createdAt: string;
}
