import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { problems, categories } from "../interview/problems";
import { AppShell } from "../components/layout/AppShell";
import {
  Trophy,
  Filter,
  Search,
  Clock3,
  ArrowUpRight,
  Sparkles,
  BrainCircuit,
  Target,
  Zap,
} from "lucide-react";

const difficultyColor: Record<string, string> = {
  Easy: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
  Medium: "border-yellow-400/20 bg-yellow-500/10 text-yellow-300",
  Hard: "border-red-400/20 bg-red-500/10 text-red-300",
};

const difficultyDot: Record<string, string> = {
  Easy: "bg-emerald-400",
  Medium: "bg-yellow-400",
  Hard: "bg-red-400",
};

export default function InterviewListPage() {
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const matchesCategory =
        category === "All" || p.category === category;

      const matchesDifficulty =
        difficulty === "All" || p.difficulty === difficulty;

      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.prompt.toLowerCase().includes(search.toLowerCase());

      return (
        matchesCategory &&
        matchesDifficulty &&
        matchesSearch
      );
    });
  }, [category, difficulty, search]);

  const easyCount = problems.filter(
    (p) => p.difficulty === "Easy",
  ).length;

  const mediumCount = problems.filter(
    (p) => p.difficulty === "Medium",
  ).length;

  const hardCount = problems.filter(
    (p) => p.difficulty === "Hard",
  ).length;

  return (
    <AppShell>
      <main className="relative min-h-screen overflow-hidden">
        {/* Ambient lighting */}
        <div className="pointer-events-none absolute left-1/2 top-[-280px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-purple-600/[0.07] blur-[150px]" />

        <div className="pointer-events-none absolute bottom-[-200px] right-[-150px] h-[500px] w-[500px] rounded-full bg-indigo-600/[0.04] blur-[140px]" />

        <div className="relative mx-auto max-w-6xl px-6 py-10 lg:px-10">
          {/* Hero */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="mb-5 flex items-center gap-2">
              <span className="flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/[0.08] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-purple-300">
                <BrainCircuit size={12} />
                Interview simulator
              </span>

              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/25">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                AI powered
              </span>
            </div>

            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <h1 className="max-w-2xl text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
                  Think like you're
                  <span className="block bg-gradient-to-r from-white via-white to-purple-300 bg-clip-text text-transparent">
                    in the interview.
                  </span>
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-6 text-white/40">
                  Solve real interview-style problems under pressure, explain
                  your thinking, and get AI-powered guidance when you need it.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Stat
                  value={problems.length}
                  label="Problems"
                />

                <Stat
                  value={categories.length}
                  label="Topics"
                />
              </div>
            </div>
          </motion.section>

          {/* Difficulty overview */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            <DifficultyCard
              label="Easy"
              count={easyCount}
              color="emerald"
              description="Build confidence"
            />

            <DifficultyCard
              label="Medium"
              count={mediumCount}
              color="yellow"
              description="Sharpen your thinking"
            />

            <DifficultyCard
              label="Hard"
              count={hardCount}
              color="red"
              description="Push your limits"
            />
          </motion.section>

          {/* Controls */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative max-w-sm">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search problems..."
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-purple-400/30 focus:bg-white/[0.05]"
                />
              </div>

              {/* Difficulty filter */}
              <div className="flex items-center gap-1.5">
                <Filter
                  size={13}
                  className="mr-1 text-white/25"
                />

                {["All", "Easy", "Medium", "Hard"].map(
                  (d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`rounded-full border px-3 py-1.5 text-[11px] transition ${
                        difficulty === d
                          ? "border-purple-400/20 bg-purple-500/15 text-purple-200"
                          : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/70"
                      }`}
                    >
                      {d}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-[10px] uppercase tracking-widest text-white/25">
                Topic
              </span>

              {["All", ...categories].map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-3 py-1.5 text-[11px] transition ${
                    category === c
                      ? "bg-white/[0.1] text-white"
                      : "text-white/35 hover:bg-white/[0.04] hover:text-white/70"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </motion.section>

          {/* Results header */}
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/25">
              {filtered.length} challenges available
            </p>

            <div className="flex items-center gap-1.5 text-[10px] text-white/25">
              <Zap size={11} />
              AI interviewer included
            </div>
          </div>

          {/* Problem grid */}
          <motion.div
            layout
            className="grid gap-3 md:grid-cols-2"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((p, index) => (
                <motion.div
                  layout
                  key={p.id}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  transition={{
                    duration: 0.25,
                    delay: index * 0.025,
                  }}
                >
                  <Link
                    to={`/interview/${p.id}`}
                    className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-purple-400/25 hover:bg-white/[0.045]"
                  >
                    {/* Hover glow */}
                    <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-purple-500/[0.06] blur-3xl opacity-0 transition duration-500 group-hover:opacity-100" />

                    <div className="relative">
                      {/* Card top */}
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                            <Target
                              size={15}
                              className="text-purple-300/80"
                            />
                          </div>

                          <div className="min-w-0">
                            <h2 className="truncate text-sm font-medium text-white/85 transition group-hover:text-white">
                              {p.title}
                            </h2>

                            <div className="mt-2 flex items-center gap-2">
                              <span
                                className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-medium ${difficultyColor[p.difficulty]}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${difficultyDot[p.difficulty]}`}
                                />

                                {p.difficulty}
                              </span>

                              <span className="text-[10px] text-white/25">
                                {p.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        <ArrowUpRight
                          size={16}
                          className="shrink-0 text-white/20 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-purple-300"
                        />
                      </div>

                      {/* Prompt */}
                      <p className="mb-5 line-clamp-2 text-xs leading-5 text-white/40">
                        {p.prompt}
                      </p>

                      {/* Card footer */}
                      <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
                        <div className="flex items-center gap-4 text-[10px] text-white/30">
                          <span className="flex items-center gap-1.5">
                            <Clock3 size={12} />
                            {Math.floor(
                              p.timeLimitSeconds / 60,
                            )}{" "}
                            min
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Sparkles size={12} />
                            AI hints
                          </span>
                        </div>

                        <span className="text-[10px] font-medium text-purple-300/60 transition group-hover:text-purple-300">
                          Start challenge
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-white/10 py-20 text-center"
            >
              <Search
                size={24}
                className="mx-auto mb-4 text-white/20"
              />

              <p className="text-sm text-white/50">
                No challenges found
              </p>

              <p className="mt-1 text-xs text-white/25">
                Try changing your filters or search query.
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </AppShell>
  );
}

function Stat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center">
      <p className="text-xl font-medium text-white/85">
        {value}
      </p>

      <p className="mt-1 text-[9px] uppercase tracking-widest text-white/25">
        {label}
      </p>
    </div>
  );
}

function DifficultyCard({
  label,
  count,
  color,
  description,
}: {
  label: string;
  count: number;
  color: "emerald" | "yellow" | "red";
  description: string;
}) {
  const styles = {
    emerald: {
      border: "border-emerald-400/15",
      bg: "bg-emerald-500/[0.04]",
      text: "text-emerald-300",
      glow: "bg-emerald-500",
    },
    yellow: {
      border: "border-yellow-400/15",
      bg: "bg-yellow-500/[0.04]",
      text: "text-yellow-300",
      glow: "bg-yellow-500",
    },
    red: {
      border: "border-red-400/15",
      bg: "bg-red-500/[0.04]",
      text: "text-red-300",
      glow: "bg-red-500",
    },
  };

  const style = styles[color];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${style.border} ${style.bg} p-4`}
    >
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full ${style.glow} opacity-[0.06] blur-2xl`}
      />

      <div className="relative flex items-center justify-between">
        <div>
          <p className={`text-xs font-medium ${style.text}`}>
            {label}
          </p>

          <p className="mt-1 text-[10px] text-white/30">
            {description}
          </p>
        </div>

        <p className={`text-2xl font-medium ${style.text}`}>
          {count}
        </p>
      </div>
    </div>
  );
}