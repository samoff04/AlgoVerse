import { useState } from "react";
import { api } from "../lib/api";
import { AppShell } from "../components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Code2,
  Lightbulb,
  MemoryStick,
  Sparkles,
} from "lucide-react";

const languages = [
  { value: "javascript", label: "JavaScript", short: "JS" },
  { value: "typescript", label: "TypeScript", short: "TS" },
  { value: "python", label: "Python", short: "PY" },
  { value: "java", label: "Java", short: "JAVA" },
  { value: "cpp", label: "C++", short: "C++" },
  { value: "go", label: "Go", short: "GO" },
];

const samples: Record<string, string> = {
  javascript: `function example(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {}
  }
}`,

  typescript: `function example(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {}
  }
}`,

  python: `def example(arr):
    for i in range(len(arr)):
        for j in range(len(arr)):
            pass`,

  java: `void example(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
        for (int j = 0; j < arr.length; j++) {}
    }
}`,

  cpp: `void example(vector<int>& arr) {
    for (int i = 0; i < arr.size(); i++) {
        for (int j = 0; j < arr.size(); j++) {}
    }
}`,

  go: `func example(arr []int) {
    for i := 0; i < len(arr); i++ {
        for j := 0; j < len(arr); j++ {}
    }
}`,
};

type ComplexityResult = {
  timeComplexity?: string;
  spaceComplexity?: string;
  explanation?: string;
  suggestions?: string;
  heuristic?: {
    complexity?: string;
    features?: {
      loopCount?: number;
      maxLoopDepth?: number;
    };
  };
};

export default function PlaygroundPage() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(samples.javascript);
  const [result, setResult] = useState<ComplexityResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleLanguageChange(lang: string) {
    setLanguage(lang);
    setCode(samples[lang] ?? "");
    setResult(null);
    setError(null);
  }

  async function analyze() {
    if (!code.trim()) {
      setError("Paste some code before running the analysis.");
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await api.post("/complexity", {
        code,
        language,
      });

      setResult(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ?? "Could not analyze this code"
      );
    } finally {
      setAnalyzing(false);
    }
  }

  const lineCount = code.split("\n").length;
  const characterCount = code.length;

  return (
    <AppShell>
      <div className="relative mx-auto max-w-7xl px-6 py-8 lg:py-10">
        {/* Ambient background */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-purple-600/[0.07] blur-[140px]" />

        {/* Header */}
        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-purple-300/70">
              <BrainCircuit size={14} />
              AI analysis engine
            </div>

            <h1 className="text-3xl font-medium tracking-[-0.04em]">
              Complexity playground
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              Paste your algorithm. AlgoVerse analyzes the actual logic,
              identifies complexity patterns, and explains the reasoning behind
              the result.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-500/[0.06] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-emerald-300/80">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Analysis engine ready
          </div>
        </header>

        {/* Main workspace */}
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* Code editor */}
          <section className="overflow-hidden rounded-3xl border border-white/[0.10] bg-white/[0.025] shadow-2xl shadow-black/20">
            <div className="flex flex-col gap-4 border-b border-white/[0.08] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10">
                  <Code2 size={16} className="text-purple-300" />
                </div>

                <div>
                  <p className="text-sm font-medium">Source code</p>
                  <p className="text-[11px] text-white/35">
                    Analyze algorithmic complexity
                  </p>
                </div>
              </div>

              <div className="flex w-fit items-center gap-1 overflow-x-auto rounded-xl border border-white/[0.08] bg-black/20 p-1">
                {languages.map((lang) => (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => handleLanguageChange(lang.value)}
                    title={lang.label}
                    className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition ${
                      language === lang.value
                        ? "bg-purple-500/20 text-purple-200 shadow-sm"
                        : "text-white/35 hover:bg-white/[0.05] hover:text-white/70"
                    }`}
                  >
                    {lang.short}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-12 border-r border-white/[0.05] bg-black/10" />

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="min-h-[430px] w-full resize-none bg-[#08080a] py-5 pl-16 pr-5 font-mono text-[13px] leading-7 text-white/80 outline-none placeholder:text-white/20"
                placeholder="Paste your code here..."
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-white/[0.08] bg-white/[0.015] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-[11px] text-white/30">
                <Activity size={13} />

                <span>
                  {lineCount} lines · {characterCount.toLocaleString()}{" "}
                  characters
                </span>
              </div>

              <Button
                onClick={analyze}
                disabled={analyzing}
                className="h-10 gap-2 rounded-xl px-5"
              >
                <Sparkles size={14} />

                {analyzing
                  ? "Analyzing logic..."
                  : "Analyze complexity"}
              </Button>
            </div>
          </section>

          {/* How it works */}
          <aside className="rounded-3xl border border-white/[0.10] bg-white/[0.025] p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
                <BrainCircuit size={16} className="text-blue-300" />
              </div>

              <div>
                <p className="text-sm font-medium">How it works</p>

                <p className="text-[11px] text-white/35">
                  Multi-layer reasoning
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-white/[0.07] bg-black/10 p-4">
                <p className="text-xs font-medium text-white/75">
                  01 · Parse
                </p>

                <p className="mt-1 text-[11px] leading-5 text-white/35">
                  Understands loops, recursion, data structures, and control
                  flow.
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-black/10 p-4">
                <p className="text-xs font-medium text-white/75">
                  02 · Reason
                </p>

                <p className="mt-1 text-[11px] leading-5 text-white/35">
                  Traces dominant operations and their growth as input scales.
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-black/10 p-4">
                <p className="text-xs font-medium text-white/75">
                  03 · Explain
                </p>

                <p className="mt-1 text-[11px] leading-5 text-white/35">
                  Converts the analysis into an explanation you can actually
                  learn from.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-purple-400/15 bg-purple-500/[0.05] p-4">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles size={13} className="text-purple-300" />

                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-purple-300/80">
                  Built for learning
                </span>
              </div>

              <p className="text-[11px] leading-5 text-white/40">
                Don't just get an answer. Understand why the algorithm scales
                the way it does.
              </p>
            </div>
          </aside>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <section className="mt-8">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-300" />

              <h2 className="text-sm font-medium">
                Analysis complete
              </h2>

              <span className="ml-1 rounded-full border border-emerald-400/15 bg-emerald-500/[0.06] px-2 py-0.5 text-[10px] text-emerald-300/70">
                AI verified
              </span>
            </div>

            {/* Complexity cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative overflow-hidden rounded-3xl border border-purple-400/20 bg-purple-500/[0.06] p-5">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl" />

                <div className="relative">
                  <div className="mb-3 flex items-center gap-2 text-xs text-white/45">
                    <Clock3 size={14} />
                    Time complexity
                  </div>

                  <p className="text-4xl font-medium tracking-tight text-purple-300">
                    {result.timeComplexity ?? "—"}
                  </p>

                  <p className="mt-2 text-[11px] text-white/35">
                    Growth of operations as input size increases
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-blue-400/15 bg-blue-500/[0.04] p-5">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/15 blur-3xl" />

                <div className="relative">
                  <div className="mb-3 flex items-center gap-2 text-xs text-white/45">
                    <MemoryStick size={14} />
                    Space complexity
                  </div>

                  <p className="text-4xl font-medium tracking-tight text-blue-300">
                    {result.spaceComplexity ?? "—"}
                  </p>

                  <p className="mt-2 text-[11px] text-white/35">
                    Additional memory used by the algorithm
                  </p>
                </div>
              </div>
            </div>

            {/* Explanation and optimization */}
            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
              <div className="rounded-3xl border border-white/[0.10] bg-white/[0.025] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <BrainCircuit size={15} className="text-purple-300" />

                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                    AI reasoning
                  </p>
                </div>

                <p className="text-sm leading-7 text-white/75">
                  {result.explanation ??
                    "No explanation was returned for this analysis."}
                </p>
              </div>

              {result.suggestions && (
                <div className="rounded-3xl border border-yellow-400/15 bg-yellow-500/[0.04] p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Lightbulb size={15} className="text-yellow-300" />

                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                      Optimization
                    </p>
                  </div>

                  <p className="text-sm leading-7 text-white/70">
                    {result.suggestions}
                  </p>
                </div>
              )}
            </div>

            {/* Heuristic metadata */}
            {result.heuristic && (
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-[11px] text-white/35">
                <span>
                  Rules-based cross-check:{" "}
                  <strong className="font-medium text-white/60">
                    {result.heuristic.complexity ?? "—"}
                  </strong>
                </span>

                <span>
                  {result.heuristic.features?.loopCount ?? 0} loop(s)
                </span>

                <span>
                  Max nesting depth:{" "}
                  {result.heuristic.features?.maxLoopDepth ?? 0}
                </span>
              </div>
            )}
          </section>
        )}
      </div>
    </AppShell>
  );
}