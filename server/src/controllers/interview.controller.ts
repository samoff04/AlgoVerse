import { Response } from "express";
import { InterviewAttempt } from "../models/InterviewAttempt";
import { awardActivity } from "../lib/awardActivity";
import { AuthRequest } from "../middleware/auth.middleware";

export async function saveAttempt(req: AuthRequest, res: Response) {
  const { problemId, runtimeMs, predictedComplexity, success } = req.body;
  const attempt = await InterviewAttempt.create({ user: req.userId, problemId, runtimeMs, predictedComplexity, success });
  const user = await awardActivity(req.userId as string, 30);
  res.json({
    attempt,
    user: user ? { id: user.id, name: user.name, email: user.email, xp: user.xp, streak: user.streak, avatarUrl: user.avatarUrl } : null,
  });
}