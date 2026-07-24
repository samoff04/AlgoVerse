import { Response } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { AuthRequest } from "../middleware/auth.middleware";

export async function interviewChat(req: AuthRequest, res: Response) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "AI interviewer is not configured. Missing API key." });
  }

  const { problemTitle, problemPrompt, code, messages } = req.body;
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = `You are conducting a live technical coding interview for this problem:
Title: ${problemTitle}
Prompt: ${problemPrompt}

The candidate's current code:
\`\`\`
${code || "(no code written yet)"}
\`\`\`

Act like a real, professional but encouraging interviewer. Ask clarifying or follow-up questions, probe edge cases, ask about time and space complexity, and give brief honest feedback on correctness and approach. Keep responses to 2-4 sentences, conversational — never lecture, never dump a full solution. If the candidate asks for the answer outright, redirect them toward reasoning it out themselves, the way a real interviewer would.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 350,
      system: systemPrompt,
      messages,
    });
    const text = response.content.find((b) => b.type === "text")?.text ?? "";
    res.json({ answer: text });
  } catch (err: any) {
    console.error("Interview chat error:", err);
    res.status(500).json({ error: err?.message ?? "Unknown error calling Claude" });
  }
}

export async function generateReport(req: AuthRequest, res: Response) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "AI reports are not configured." });
  }
  const { problemTitle, code, transcript } = req.body;
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 500,
      system: `You are grading a mock technical interview. Respond ONLY with valid JSON, no markdown fences, exactly this shape:
{"score": 0-100, "correctness": "1-2 sentences", "communication": "1-2 sentences", "complexity": "1-2 sentences", "improvementTip": "1 sentence"}`,
      messages: [{
        role: "user",
        content: `Problem: ${problemTitle}\nFinal code:\n${code}\n\nConversation transcript:\n${transcript}`,
      }],
    });
    const text = response.content.find((b) => b.type === "text")?.text ?? "{}";
    res.json(JSON.parse(text.trim()));
  } catch (err: any) {
    console.error("Report error:", err);
    res.status(500).json({ error: err?.message ?? "Could not generate report" });
  }
}