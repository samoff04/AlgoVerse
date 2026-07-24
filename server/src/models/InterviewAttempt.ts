import mongoose, { Schema, Document } from "mongoose";

export interface IInterviewAttempt extends Document {
  user: mongoose.Types.ObjectId;
  problemId: string;
  runtimeMs: number;
  predictedComplexity: string;
  success: boolean;
  completedAt: Date;
}

const InterviewAttemptSchema = new Schema<IInterviewAttempt>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  problemId: { type: String, required: true },
  runtimeMs: { type: Number, required: true },
  predictedComplexity: { type: String, required: true },
  success: { type: Boolean, required: true },
  completedAt: { type: Date, default: Date.now },
});

export const InterviewAttempt = mongoose.model<IInterviewAttempt>("InterviewAttempt", InterviewAttemptSchema);