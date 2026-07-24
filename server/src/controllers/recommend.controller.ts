import { Response } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { Progress } from "../models/Progress";
import { AuthRequest } from "../middleware/auth.middleware";

export async function getRecommendation(req: AuthRequest, res: Response) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.json({ recommendation: "Start with bubble sort to get familiar with the visualizer, then move to binary search trees." });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const progress = await Progress.find({ user: req.userId });

  const summary = progress.length
    ? progress.map((p) => `${p.algorithmSlug}: ${Math.round(p.masteryScore * 100)}% mastery`).join(", ")
    : "no algorithms attempted yet";

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 120,
      system: "You are a DSA learning coach. Given a learner's progress, recommend exactly one next topic to study and explain why in one short sentence. Be specific and encouraging, under 30 words total.",
      messages: [{ role: "user", content: `My progress so far: ${summary}. What should I study next?` }],
    });
    const text = response.content.find((b) => b.type === "text")?.text ?? "";
    res.json({ recommendation: text });
  } catch (err: any) {
    console.error("Recommend error:", err);
    res.json({ recommendation: "Keep practicing sorting algorithms — they're the foundation for everything else." });
  }
}