import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  avatarUrl?: string;
  xp: number;
  streak: number;
  lastActiveDate?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  avatarUrl: { type: String },
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>("User", UserSchema);