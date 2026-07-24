import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../lib/api";
import { problems } from "../interview/problems";
import { AppShell } from "../components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  Users,
  Swords,
  ArrowRight,
  Clock3,
  Zap,
  Shield,
  Copy,
  Sparkles,
  Trophy,
  Hash,
} from "lucide-react";

export default function ContestLobbyPage() {
  const navigate = useNavigate();

  const [problemId, setProblemId] = useState(problems[0].id);
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedProblem = problems.find((p) => p.id === problemId);

  async function handleCreate() {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post("/contest", {
        problemId,
        timeLimitSeconds: 600,
      });

      navigate(`/contest/${data.contest.code}`);
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Could not create contest");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (!joinCode.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await api.post("/contest/join", {
        code: joinCode.trim(),
      });

      navigate(`/contest/${joinCode.trim().toUpperCase()}`);
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Could not join contest");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <main className="relative min-h-screen overflow-hidden">
        {/* Ambient background */}
        <div className="pointer-events-none absolute left-1/2 top-[-260px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-purple-600/[0.08] blur-[150px]" />

        <div className="pointer-events-none absolute bottom-[-200px] left-[-150px] h-[500px] w-[500px] rounded-full bg-indigo-600/[0.05] blur-[140px]" />

        {/* Floating particles */}
        <FloatingParticle className="left-[12%] top-[20%]" delay={0} />
        <FloatingParticle className="right-[15%] top-[30%]" delay={1.2} />
        <FloatingParticle className="left-[25%] bottom-[20%]" delay={2} />

        <div className="relative mx-auto max-w-6xl px-6 py-10 lg:px-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/[0.08] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-purple-300"
            >
              <Swords size={12} />
              Competitive mode
            </div>

            <h1 className="mx-auto max-w-3xl text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
              Think fast.
              <span className="block bg-gradient-to-r from-white via-white to-purple-300 bg-clip-text text-transparent">
                Code faster.
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-white/40">
              Challenge your friends, solve the same problem, and see who can
              turn logic into code first.
            </p>
          </motion.div>

          {/* Main cards */}
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Create Contest */}
            <motion.section
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8"
            >
              {/* Card glow */}
              <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-purple-500/[0.08] blur-[90px] transition duration-700 group-hover:bg-purple-500/[0.15]" />

              <div className="relative">
                <div className="mb-8 flex items-start justify-between">
                  <div>
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10">
                      <Trophy size={19} className="text-purple-300" />
                    </div>

                    <h2 className="text-xl font-medium">
                      Create a challenge
                    </h2>

                    <p className="mt-1 text-sm text-white/40">
                      Choose a problem and invite someone to compete.
                    </p>
                  </div>

                  <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest text-emerald-300">
                    Live
                  </span>
                </div>

                {/* Problem selector */}
                <div className="mb-5">
                  <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">
                    Select challenge
                  </label>

                  <div className="relative">
                    <select
                      value={problemId}
                      onChange={(e) => setProblemId(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-10 text-sm text-white outline-none transition focus:border-purple-400/40 focus:bg-white/[0.06]"
                    >
                      {problems.map((p) => (
                        <option
                          key={p.id}
                          value={p.id}
                          className="bg-[#0a0a0c]"
                        >
                          {p.title}
                        </option>
                      ))}
                    </select>

                    <ArrowRight
                      size={15}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-white/30"
                    />
                  </div>
                </div>

                {/* Challenge preview */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedProblem?.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-6 rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest text-white/30">
                        Challenge preview
                      </span>

                      <span className="flex items-center gap-1.5 text-[10px] text-orange-300/70">
                        <Zap size={11} />
                        Competitive
                      </span>
                    </div>

                    <p className="text-sm font-medium text-white/80">
                      {selectedProblem?.title}
                    </p>

                    <div className="mt-4 flex items-center gap-4 text-[10px] text-white/35">
                      <span className="flex items-center gap-1.5">
                        <Clock3 size={12} />
                        10 minutes
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Users size={12} />
                        2 players
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Shield size={12} />
                        Real-time
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <Button
                  onClick={handleCreate}
                  disabled={loading}
                  className="group/btn h-12 w-full rounded-xl bg-white text-black transition hover:bg-white/90"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                      Creating room...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Create contest room
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover/btn:translate-x-1"
                      />
                    </span>
                  )}
                </Button>
              </div>
            </motion.section>

            {/* Join Contest */}
            <motion.section
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8"
            >
              <div className="mb-8">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                  <Users size={19} className="text-white/60" />
                </div>

                <h2 className="text-xl font-medium">
                  Join a challenge
                </h2>

                <p className="mt-1 text-sm text-white/40">
                  Enter a room code to join an active contest.
                </p>
              </div>

              <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">
                Room code
              </label>

              <div className="relative mb-4">
                <Hash
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  value={joinCode}
                  onChange={(e) =>
                    setJoinCode(e.target.value.toUpperCase())
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleJoin();
                    }
                  }}
                  placeholder="ABCDE"
                  maxLength={5}
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-center text-sm uppercase tracking-[0.4em] text-white outline-none transition placeholder:text-white/20 focus:border-purple-400/40 focus:bg-white/[0.06]"
                />
              </div>

              <Button
                onClick={handleJoin}
                disabled={loading || joinCode.length < 5}
                variant="outline"
                className="h-12 w-full rounded-xl border-white/15 bg-transparent text-white transition hover:border-white/30 hover:bg-white/[0.05]"
              >
                {loading ? "Joining..." : "Join contest"}
              </Button>

              <div className="mt-8 flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                  <Copy size={13} className="text-purple-300" />
                </div>

                <p className="text-[11px] leading-4 text-white/35">
                  Your friend can share the room code after creating a
                  challenge.
                </p>
              </div>
            </motion.section>
          </div>

          {/* How it works */}
          <motion.section
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/25">
                  The format
                </p>

                <h2 className="text-lg font-medium">
                  How contests work
                </h2>
              </div>

              <Sparkles size={16} className="text-purple-300/50" />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Step
                number="01"
                title="Create or join"
                description="Start a room or enter a friend's challenge code."
              />

              <Step
                number="02"
                title="Race the clock"
                description="Solve the same problem under the same time limit."
              />

              <Step
                number="03"
                title="See who wins"
                description="Compare solutions and let the fastest logic win."
              />
            </div>
          </motion.section>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-auto mt-6 max-w-xl rounded-xl border border-red-400/20 bg-red-500/[0.06] px-4 py-3 text-center text-sm text-red-300"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </AppShell>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-purple-400/20 hover:bg-white/[0.04]">
      <p className="mb-5 text-[10px] font-medium tracking-[0.2em] text-purple-300/60">
        {number}
      </p>

      <h3 className="mb-1 text-sm font-medium text-white/80">
        {title}
      </h3>

      <p className="text-xs leading-5 text-white/35">
        {description}
      </p>
    </div>
  );
}

function FloatingParticle({
  className,
  delay,
}: {
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute h-1 w-1 rounded-full bg-purple-300/40 ${className}`}
      animate={{
        y: [0, -18, 0],
        opacity: [0.2, 0.8, 0.2],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}