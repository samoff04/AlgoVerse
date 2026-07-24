import mongoose, { Schema, Document } from "mongoose";

export interface IProgress extends Document {
  user: mongoose.Types.ObjectId;
  algorithmSlug: string;
  masteryScore: number;
  lastReviewed: Date;
}

const ProgressSchema = new Schema<IProgress>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  algorithmSlug: { type: String, required: true },
  masteryScore: { type: Number, default: 0 },
  lastReviewed: { type: Date, default: Date.now },
});

ProgressSchema.index({ user: 1, algorithmSlug: 1 }, { unique: true });

export const Progress = mongoose.model<IProgress>("Progress", ProgressSchema);