import { Response } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { AuthRequest } from "../middleware/auth.middleware";

export async function askTutor(req: AuthRequest, res: Response) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "AI tutor is not configured. Missing API key." });
  }
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const { messages, stepContext } = req.body;

  try {
    const systemPrompt = stepContext
      ? `You are a friendly, sharp DSA tutor embedded in a 3D visualization tool. The learner is viewing this exact state: ${JSON.stringify(stepContext)}. Ground your answer in it. Keep answers to 2-4 sentences.`
      : `You are a friendly, sharp DSA tutor. Keep answers to 2-4 sentences.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 400,
      system: systemPrompt,
      messages,
    });

    const text = response.content.find((b) => b.type === "text")?.text ?? "";
    res.json({ answer: text });
  } catch (err: any) {
    console.error("Tutor error:", err);
    res.status(500).json({ error: err?.message ?? "Unknown error calling Claude API" });
  }
}