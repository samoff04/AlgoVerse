import { Response } from "express";
import { Contest } from "../models/Contest";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";

function generateCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

export async function createContest(req: AuthRequest, res: Response) {
  const { problemId, timeLimitSeconds } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  let code = generateCode();
  while (await Contest.findOne({ code })) code = generateCode();

  const contest = await Contest.create({
    code,
    hostId: user.id,
    problemId,
    timeLimitSeconds: timeLimitSeconds ?? 600,
    participants: [{ userId: user.id, name: user.name, avatarUrl: user.avatarUrl, status: "waiting", score: 0 }],
  });

  res.json({ contest });
}

export async function joinContest(req: AuthRequest, res: Response) {
  const { code } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const contest = await Contest.findOne({ code: code.toUpperCase() });
  if (!contest) return res.status(404).json({ error: "No contest found with that code" });
  if (contest.status === "finished") return res.status(400).json({ error: "This contest has already ended" });

  const alreadyIn = contest.participants.some((p) => p.userId.toString() === user.id);
  if (!alreadyIn) {
    contest.participants.push({ userId: user._id as any, name: user.name, avatarUrl: user.avatarUrl, status: "waiting", score: 0 });
    await contest.save();
  }

  res.json({ contest });
}

export async function getContest(req: AuthRequest, res: Response) {
  const contest = await Contest.findOne({ code: req.params.code.toUpperCase() });
  if (!contest) return res.status(404).json({ error: "Contest not found" });
  res.json({ contest });
}