import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProblem } from "../interview/problems";
import { languages, starterTemplate } from "../interview/languages";
import { useCountdown } from "../interview/useCountdown";
import { api } from "../lib/api";
import { AppShell } from "../components/layout/AppShell";
import { LanguageSelector } from "../components/interview/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Info } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useAuthStore } from "../stores/authStore";
import { runUserCode } from "../lib/runUserCode";
import { computeVisualState } from "../engine-core/replay";
import { ArrayScene } from "../components/scene/ArrayScene";
import { PlaybackControls } from "../components/playback/PlaybackControls";
import { usePlaybackStore } from "../stores/playbackStore";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function InterviewProblemPage() {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const problem = getProblem(problemId as string);
  const setUser = useAuthStore((s) => s.setUser);

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(problem ? starterTemplate("javascript", problem.functionName, problem.prompt) : "");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: `Let's get started. Walk me through how you'd approach "${problem?.title}" before you start coding.` },
  ]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [phase, setPhase] = useState<"solving" | "replay">("solving");
  const [result, setResult] = useState<ReturnType<typeof runUserCode> | null>(null);
  const [hintCount, setHintCount] = useState(0);
  const [report, setReport] = useState<any | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const timer = useCountdown(problem?.timeLimitSeconds ?? 600, () => {});
  const step = usePlaybackStore((s) => s.step);
  const setTotalSteps = usePlaybackStore((s) => s.setTotalSteps);

  useEffect(() => {
    timer.start();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, chatLoading]);

  if (!problem) {
    return (
      <AppShell>
        <div className="p-8 text-white/50">Problem not found.</div>
      </AppShell>
    );
  }

  const currentLang = languages.find((l) => l.id === language)!;
  const canVisualize = currentLang.executable && problem.visualizable !== false;

  function handleLanguageChange(id: string) {
    setLanguage(id);
    setCode(starterTemplate(id, problem!.functionName, problem!.prompt));
  }

  async function sendToInterviewer(userMessage: string) {
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setChatLoading(true);
    try {
      const { data } = await api.post("/interview-chat", {
        problemTitle: problem!.title,
        problemPrompt: problem!.prompt,
        code: `[${currentLang.label}]\n${code}`,
        messages: newMessages,
      });
      setMessages([...newMessages, { role: "assistant", content: data.answer }]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: `I couldn't respond just now: ${err.response?.data?.error ?? err.message}` },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  function handleSend() {
    if (!input.trim() || chatLoading) return;
    const msg = input;
    setInput("");
    sendToInterviewer(msg);
  }

  async function handleHint() {
    setHintCount((n) => n + 1);
    await sendToInterviewer("Can I get a hint, without giving away the full solution?");
  }

  async function handleSubmitForReview() {
    timer.stop();

    if (canVisualize) {
      const r = runUserCode(code, problem!.functionName, problem!.testInput);
      setResult(r);
      setTotalSteps(Math.max(r.events.length - 1, 0));
      setPhase("replay");
    } else {
      setResult(null);
      setPhase("replay");
    }

    await sendToInterviewer(
      `Here is my final solution in ${currentLang.label}:\n\`\`\`\n${code}\n\`\`\`\nPlease review it — is it correct, what's the time and space complexity, and any feedback?`
    );

    try {
      const { data } = await api.post("/interview", {
        problemId: problem!.id,
        runtimeMs: 0,
        predictedComplexity: "see AI feedback",
        success: canVisualize ? result?.success ?? true : true,
      });
      if (data.user) setUser(data.user);
    } catch {}

    setGeneratingReport(true);
    try {
      const transcript = messages.map((m) => `${m.role}: ${m.content}`).join("\n");
      const { data } = await api.post("/interview-chat/report", { problemTitle: problem!.title, code, transcript });
      setReport(data);
    } catch {}
    setGeneratingReport(false);
  }

  const state =
    phase === "replay" && result
      ? computeVisualState({ initialArray: problem.testInput, events: result.events, codeLineMap: {} }, step)
      : null;

  return (
    <AppShell>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 py-6 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-medium">{problem.title}</h1>
            <span className={`text-sm ${timer.remaining < 60 ? "text-red-400" : "text-white/60"}`}>{timer.formatted}</span>
          </div>
          <p className="mb-4 text-sm text-white/60">{problem.prompt}</p>

          {phase === "solving" ? (
            <>
              <div className="mb-2 flex items-center justify-between">
                <LanguageSelector value={language} onChange={handleLanguageChange} />
                {!canVisualize && (
                  <span className="flex items-center gap-1.5 text-xs text-white/40">
                    <Info size={12} />
                    {currentLang.executable
                      ? "This problem's structure isn't visualizable — you'll get full AI review only"
                      : "3D replay requires JavaScript — this language gets full AI review only"}
                  </span>
                )}
              </div>
              <div className="h-[420px] overflow-hidden rounded-2xl border border-white/10">
                <Editor
                  height="100%"
                  language={currentLang.monacoId}
                  value={code}
                  onChange={(v) => setCode(v ?? "")}
                  theme="vs-dark"
                  options={{ fontSize: 13, minimap: { enabled: false } }}
                />
              </div>
            </>
          ) : canVisualize ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              {state ? (
                <>
                  <div className="h-[380px]">
                    <ArrayScene state={state} />
                  </div>
                  <div className="border-t border-white/10">
                    <PlaybackControls />
                  </div>
                </>
              ) : (
                <div className="flex h-[420px] items-center justify-center text-sm text-white/30">No visualization available</div>
              )}
              {result && !result.success && (
                <p className="border-t border-red-400/20 bg-red-500/[0.05] px-4 py-3 text-xs text-red-400">Error: {result.error}</p>
              )}
            </div>
          ) : (
            <div className="flex h-[420px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] px-8 text-center text-sm text-white/40">
              Visualization isn't available for this problem or language — check the AI interviewer panel for a full review of your
              solution.
            </div>
          )}

          <div className="mt-4 flex gap-3">
            {phase === "solving" ? (
              <>
                <Button onClick={handleSubmitForReview}>Submit for review</Button>
                <Button variant="outline" onClick={handleHint} className="border-white/15 text-white">
                  Hint {hintCount > 0 && `(${hintCount} used)`}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setPhase("solving")} className="border-white/15 text-white">
                Back to editor
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate("/interview")} className="border-white/15 text-white">
              Back to problems
            </Button>
          </div>

          {(generatingReport || report) && (
            <div className="mt-4 rounded-2xl border border-purple-400/20 bg-purple-500/[0.05] p-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-purple-300">Performance report</p>
              {generatingReport ? (
                <p className="text-sm text-white/50">Scoring your interview...</p>
              ) : (
                <>
                  <p className="mb-3 text-3xl font-medium text-purple-300">
                    {report.score}
                    <span className="text-sm text-white/40">/100</span>
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-white/40">Correctness: </span>
                      <span className="text-white/80">{report.correctness}</span>
                    </p>
                    <p>
                      <span className="text-white/40">Communication: </span>
                      <span className="text-white/80">{report.communication}</span>
                    </p>
                    <p>
                      <span className="text-white/40">Complexity: </span>
                      <span className="text-white/80">{report.complexity}</span>
                    </p>
                    <p>
                      <span className="text-white/40">Tip: </span>
                      <span className="text-white/80">{report.improvementTip}</span>
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex h-[560px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c]">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <Sparkles size={14} className="text-purple-300" />
            <span className="text-sm font-medium">AI Interviewer</span>
          </div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[90%] whitespace-pre-wrap rounded-xl px-3 py-2 text-[13px] leading-relaxed ${
                    m.role === "user" ? "bg-purple-500/20 text-purple-100" : "bg-white/5 text-white/80"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-xl bg-white/5 px-3 py-2.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 border-t border-white/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Talk through your approach..."
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[13px] outline-none focus:border-purple-400/40"
            />
            <button
              onClick={handleSend}
              disabled={chatLoading}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300 disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}