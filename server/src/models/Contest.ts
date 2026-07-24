import mongoose, { Schema, Document } from "mongoose";

export interface IParticipant {
  userId: mongoose.Types.ObjectId;
  name: string;
  avatarUrl?: string;
  status: "waiting" | "solving" | "submitted";
  submittedAt?: Date;
  timeTakenMs?: number;
  score: number;
}

export interface IContest extends Document {
  code: string;
  hostId: mongoose.Types.ObjectId;
  problemId: string;
  status: "lobby" | "active" | "finished";
  startedAt?: Date;
  timeLimitSeconds: number;
  participants: IParticipant[];
  createdAt: Date;
}

const ContestSchema = new Schema<IContest>({
  code: { type: String, required: true, unique: true },
  hostId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  problemId: { type: String, required: true },
  status: { type: String, enum: ["lobby", "active", "finished"], default: "lobby" },
  startedAt: { type: Date },
  timeLimitSeconds: { type: Number, default: 600 },
  participants: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      name: String,
      avatarUrl: String,
      status: { type: String, enum: ["waiting", "solving", "submitted"], default: "waiting" },
      submittedAt: Date,
      timeTakenMs: Number,
      score: { type: Number, default: 0 },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export const Contest = mongoose.model<IContest>("Contest", ContestSchema);