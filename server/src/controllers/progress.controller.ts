import { Response } from "express";
import { Progress } from "../models/Progress";
import { awardActivity } from "../lib/awardActivity";
import { AuthRequest } from "../middleware/auth.middleware";

export async function saveProgress(req: AuthRequest, res: Response) {
  const { algorithmSlug, masteryScore } = req.body;

  const existing = await Progress.findOne({ user: req.userId, algorithmSlug });
  const isFirstCompletion = !existing || existing.masteryScore < masteryScore;

  const progress = await Progress.findOneAndUpdate(
    { user: req.userId, algorithmSlug },
    { masteryScore, lastReviewed: new Date() },
    { upsert: true, new: true }
  );

  const user = isFirstCompletion ? await awardActivity(req.userId as string, Math.round(masteryScore * 50)) : null;

  res.json({
    progress,
    user: user ? { id: user.id, name: user.name, email: user.email, xp: user.xp, streak: user.streak, avatarUrl: user.avatarUrl } : null,
  });
}

export async function getAllProgress(req: AuthRequest, res: Response) {
  const progress = await Progress.find({ user: req.userId });
  res.json({ progress });
}

export async function getRecentActivity(req: AuthRequest, res: Response) {
  const recent = await Progress.find({ user: req.userId }).sort({ lastReviewed: -1 }).limit(5);
  res.json({ recent });
}