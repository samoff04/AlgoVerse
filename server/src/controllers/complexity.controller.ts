import { Response } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { extractFeatures, predictComplexity } from "../ml/complexityClassifier";
import { AuthRequest } from "../middleware/auth.middleware";

function guessFunctionName(code: string): string {
  const match = code.match(/function\s+(\w+)/);
  return match ? match[1] : "example";
}

export async function analyzeComplexity(req: AuthRequest, res: Response) {
  const { code, language } = req.body;
  if (!code || !language) {
    return res.status(400).json({ error: "code and language are required" });
  }

  let heuristic: { complexity: string; features: any } | null = null;
  if (language === "javascript" || language === "typescript") {
    try {
      const features = extractFeatures(code, guessFunctionName(code));
      const complexity = await predictComplexity(features);
      heuristic = { complexity, features };
    } catch {
      heuristic = null;
    }
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.json({
      timeComplexity: heuristic?.complexity ?? "Unavailable without AI configured",
      spaceComplexity: "Unavailable without AI configured",
      explanation: "AI analysis is not configured on this server. Set ANTHROPIC_API_KEY to enable full multi-language analysis.",
      suggestions: "",
      heuristic,
    });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 500,
      system: `You are a precise algorithm complexity analyzer. Given code in any programming language, respond ONLY with valid JSON in exactly this shape, no markdown code fences, no extra commentary before or after:
{"timeComplexity": "O(...)", "spaceComplexity": "O(...)", "explanation": "2-3 sentence explanation grounded in the actual code structure", "suggestions": "one short sentence on how to improve it, or empty string if it is already optimal"}`,
      messages: [{ role: "user", content: `Language: ${language}\n\nCode:\n${code}` }],
    });

    const text = response.content.find((b) => b.type === "text")?.text ?? "{}";
    const parsed = JSON.parse(text.trim());
    res.json({ ...parsed, heuristic });
  } catch (err: any) {
    console.error("Complexity analysis error:", err);
    res.status(500).json({ error: err?.message ?? "Could not analyze this code" });
  }
}