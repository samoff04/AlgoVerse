import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";

function signToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "30d" });
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: "An account with this email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  const token = signToken(user.id);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, xp: user.xp, streak: user.streak } });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.password) return res.status(401).json({ error: "Invalid email or password" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid email or password" });

  const token = signToken(user.id);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, xp: user.xp, streak: user.streak } });
}

export async function getMe(req: AuthRequest, res: Response) {
  const user = await User.findById(req.userId).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user });
}

export function googleCallback(req: Request, res: Response) {
  const user = req.user as any;
  const token = signToken(user.id);
  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
}