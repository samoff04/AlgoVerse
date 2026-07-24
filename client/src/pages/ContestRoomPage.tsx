import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { socket } from "../lib/socket";
import { api } from "../lib/api";
import { useAuthStore } from "../stores/authStore";
import { getProblem } from "../interview/problems";
import { runUserCode } from "../lib/runUserCode";
import { AppShell } from "../components/layout/AppShell";
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import {
  Trophy,
  Crown,
  Clock,
  Copy,
  Check,
  Users,
  Play,
  Send,
  Code2,
  Zap,
  ShieldCheck,
  Circle,
} from "lucide-react";

interface Participant {
  userId: string;
  name: string;
  avatarUrl?: string;
  status: "waiting" | "solving" | "submitted";
  timeTakenMs?: number;
  score: number;
}

interface ContestState {
  code: string;
  hostId: string;
  problemId: string;
  status: "lobby" | "active" | "finished";
  startedAt?: string;
  timeLimitSeconds: number;
  participants: Participant[];
}

export default function ContestRoomPage() {
  const { code } = useParams<{ code: string }>();

  const user = useAuthStore((s) => s.user);

  const [contest, setContest] = useState<ContestState | null>(null);
  const [code_, setCode_] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const problem = contest ? getProblem(contest.problemId) : null;

  useEffect(() => {
    if (!code) return;

    api.get(`/contest/${code}`).then((res) => {
      setContest(res.data.contest);

      const p = getProblem(res.data.contest.problemId);

      if (p) {
        setCode_(p.starterCode);
      }
    });

    socket.connect();

    socket.emit("contest:join-room", {
      code,
      userId: user?.id,
    });

    socket.on("contest:state", (state: ContestState) => {
      setContest(state);
    });

    return () => {
      socket.off("contest:state");
      socket.disconnect();
    };
  }, [code, user?.id]);

  useEffect(() => {
    if (contest?.status === "active" && contest.startedAt) {
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - new Date(contest.startedAt!).getTime());
      }, 500);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [contest?.status, contest?.startedAt]);

  if (!contest || !problem) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-white/40">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-purple-400" />
            Loading contest arena...
          </div>
        </div>
      </AppShell>
    );
  }

  const isHost = user?.id === contest.hostId;

  const me = contest.participants.find(
    (p) => p.userId === user?.id,
  );

  const sorted = [...contest.participants].sort((a, b) => {
    if (
      a.status === "submitted" &&
      b.status !== "submitted"
    ) {
      return -1;
    }

    if (
      b.status === "submitted" &&
      a.status !== "submitted"
    ) {
      return 1;
    }

    return (
      (a.timeTakenMs ?? Infinity) -
      (b.timeTakenMs ?? Infinity)
    );
  });

  function handleStart() {
    socket.emit("contest:start", { code });
  }

  function handleSubmit() {
    if (submitting || me?.status === "submitted") return;

    setSubmitting(true);

    const testInput = [8, 3, 6, 1, 9, 4];

    const result = runUserCode(
      code_,
      problem!.functionName,
      testInput,
    );

    const score = result.success ? 100 : 20;

    socket.emit("contest:submit", {
      code,
      userId: user?.id,
      score,
    });

    setTimeout(() => {
      setSubmitting(false);
    }, 800);
  }

  async function copyCode() {
    await navigator.clipboard.writeText(contest.code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  const seconds = Math.floor(elapsed / 1000);

  const mm = Math.floor(seconds / 60);

  const ss = seconds % 60;

  const totalSeconds = contest.timeLimitSeconds;

  const remainingSeconds = Math.max(
    0,
    totalSeconds - seconds,
  );

  const remainingMinutes = Math.floor(
    remainingSeconds / 60,
  );

  const remainingSecs = remainingSeconds % 60;

  const isLowTime = remainingSeconds <= 60;

  return (
    <AppShell>
      <main className="relative min-h-screen overflow-hidden">
        {/* Ambient background */}
        <div className="pointer-events-none absolute left-1/2 top-[-300px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-purple-600/[0.07] blur-[150px]" />

        <div className="pointer-events-none absolute bottom-[-200px] right-[-150px] h-[500px] w-[500px] rounded-full bg-indigo-600/[0.05] blur-[140px]" />

        <div className="relative mx-auto max-w-[1500px] px-6 py-6 lg:px-10">
          {/* Top bar */}
          <motion.header
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10">
                <SwordsIcon />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-medium">
                    Live coding arena
                  </h1>

                  <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-emerald-300/70">
                    <motion.span
                      animate={{
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                      className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                    />
                    Live
                  </span>
                </div>

                <p className="mt-0.5 text-xs text-white/35">
                  Solve faster. Think sharper. Ship the solution.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Room code */}
              <button
                onClick={copyCode}
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 transition hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div>
                  <p className="text-left text-[9px] uppercase tracking-widest text-white/25">
                    Room
                  </p>

                  <p className="font-mono text-sm font-medium tracking-[0.25em] text-white/80">
                    {contest.code}
                  </p>
                </div>

                {copied ? (
                  <Check
                    size={14}
                    className="text-emerald-300"
                  />
                ) : (
                  <Copy
                    size={14}
                    className="text-white/30 transition group-hover:text-white/60"
                  />
                )}
              </button>

              {/* Timer */}
              {contest.status === "active" && (
                <motion.div
                  animate={
                    isLowTime
                      ? {
                          scale: [1, 1.03, 1],
                        }
                      : {}
                  }
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 ${
                    isLowTime
                      ? "border-red-400/30 bg-red-500/10 text-red-300"
                      : "border-white/10 bg-white/[0.03] text-white/70"
                  }`}
                >
                  <Clock size={15} />

                  <span className="font-mono text-sm font-medium">
                    {remainingMinutes}:
                    {remainingSecs
                      .toString()
                      .padStart(2, "0")}
                  </span>
                </motion.div>
              )}
            </div>
          </motion.header>

          {/* Contest state banner */}
          <AnimatePresence mode="wait">
            {contest.status === "lobby" && (
              <motion.div
                key="lobby"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 overflow-hidden rounded-2xl border border-purple-400/20 bg-purple-500/[0.06]"
              >
                <div className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                      <Users
                        size={18}
                        className="text-purple-300"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        Waiting for the match to begin
                      </p>

                      <p className="mt-1 text-xs text-white/40">
                        {contest.participants.length} player
                        {contest.participants.length !== 1
                          ? "s"
                          : ""}{" "}
                        in the arena
                      </p>
                    </div>
                  </div>

                  {isHost && (
                    <Button
                      onClick={handleStart}
                      className="rounded-xl"
                    >
                      <Play size={14} />
                      Start contest
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            {contest.status === "finished" && (
              <motion.div
                key="finished"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 flex items-center gap-3 rounded-2xl border border-yellow-400/20 bg-yellow-500/[0.06] p-5"
              >
                <Trophy
                  size={19}
                  className="text-yellow-300"
                />

                <div>
                  <p className="text-sm font-medium">
                    Contest finished
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    The final leaderboard is now locked.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main workspace */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            {/* Problem + editor */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Problem header */}
              <div className="mb-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest text-purple-300">
                    Challenge
                  </span>

                  <span className="flex items-center gap-1.5 text-[10px] text-white/30">
                    <Zap size={11} />
                    {contest.timeLimitSeconds / 60} min
                  </span>
                </div>

                <h2 className="text-2xl font-medium tracking-tight">
                  {problem.title}
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">
                  {problem.prompt}
                </p>
              </div>

              {/* Editor */}
              {contest.status !== "lobby" && (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#08080b] shadow-2xl shadow-black/20">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.05]">
                        <Code2
                          size={14}
                          className="text-purple-300"
                        />
                      </div>

                      <div>
                        <p className="text-xs font-medium">
                          Solution editor
                        </p>

                        <p className="text-[9px] text-white/25">
                          JavaScript
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-white/25">
                      <Circle
                        size={6}
                        fill="currentColor"
                      />
                      Ready
                    </div>
                  </div>

                  <div className="h-[520px]">
                    <Editor
                      height="100%"
                      defaultLanguage="javascript"
                      value={code_}
                      onChange={(v) => setCode_(v ?? "")}
                      theme="vs-dark"
                      options={{
                        fontSize: 13,
                        minimap: {
                          enabled: false,
                        },
                        padding: {
                          top: 16,
                        },
                        readOnly:
                          me?.status === "submitted",
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                    <div className="flex items-center gap-2 text-[10px] text-white/25">
                      <ShieldCheck size={12} />
                      Your code stays private
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={
                        submitting ||
                        me?.status === "submitted" ||
                        contest.status === "finished"
                      }
                      className="rounded-lg"
                    >
                      {submitting ? (
                        <>
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Evaluating
                        </>
                      ) : me?.status === "submitted" ? (
                        <>
                          <Check size={14} />
                          Submitted
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          Submit solution
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </motion.section>

            {/* Leaderboard */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="h-fit overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                    <Trophy
                      size={15}
                      className="text-purple-300"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Leaderboard
                    </p>

                    <p className="text-[10px] text-white/30">
                      Live rankings
                    </p>
                  </div>
                </div>

                <span className="text-xs text-white/30">
                  {contest.participants.length}
                </span>
              </div>

              <div className="p-3">
                <AnimatePresence initial={false}>
                  {sorted.map((p, i) => (
                    <motion.div
                      layout
                      key={p.userId}
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className={`mb-1 flex items-center justify-between rounded-xl px-3 py-3 transition ${
                        p.userId === user?.id
                          ? "border border-purple-400/15 bg-purple-500/[0.08]"
                          : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex w-5 justify-center">
                          {i === 0 &&
                          p.status === "submitted" ? (
                            <Crown
                              size={15}
                              className="text-yellow-400"
                            />
                          ) : (
                            <span className="text-xs text-white/30">
                              {i + 1}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p
                            className={`truncate text-sm ${
                              p.userId === user?.id
                                ? "font-medium text-purple-200"
                                : "text-white/70"
                            }`}
                          >
                            {p.name}
                            {p.userId === user?.id && (
                              <span className="ml-2 text-[9px] uppercase tracking-widest text-purple-300/50">
                                You
                              </span>
                            )}
                          </p>

                          <div className="mt-1 flex items-center gap-1.5">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                p.status === "submitted"
                                  ? "bg-emerald-400"
                                  : p.status === "solving"
                                    ? "bg-yellow-400"
                                    : "bg-white/20"
                              }`}
                            />

                            <span className="text-[9px] uppercase tracking-widest text-white/25">
                              {p.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {p.status === "submitted" ? (
                          <>
                            <p className="text-xs font-medium text-white/70">
                              {(
                                (p.timeTakenMs ?? 0) /
                                1000
                              ).toFixed(1)}
                              s
                            </p>

                            <p className="mt-1 text-[9px] text-emerald-300/60">
                              {p.score} pts
                            </p>
                          </>
                        ) : (
                          <span className="text-[10px] text-white/25">
                            —
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Sidebar footer */}
              <div className="border-t border-white/10 px-5 py-4">
                <div className="flex items-center gap-2 text-[10px] text-white/25">
                  <Users size={12} />
                  Live participant updates enabled
                </div>
              </div>
            </motion.aside>
          </div>

          {/* Bottom stats */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard
              icon={Clock}
              label="Time limit"
              value={`${contest.timeLimitSeconds / 60} minutes`}
            />

            <StatCard
              icon={Users}
              label="Participants"
              value={`${contest.participants.length} competing`}
            />

            <StatCard
              icon={Zap}
              label="Your status"
              value={
                me?.status === "submitted"
                  ? "Solution submitted"
                  : contest.status === "active"
                    ? "Currently solving"
                    : "Waiting to start"
              }
            />
          </div>
        </div>
      </main>
    </AppShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-2 flex items-center gap-2 text-white/30">
        <Icon
          size={13}
          className="text-purple-300/70"
        />

        <span className="text-[9px] font-medium uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>

      <p className="text-sm text-white/60">
        {value}
      </p>
    </div>
  );
}

function SwordsIcon() {
  return (
    <div className="relative">
      <span className="absolute left-1/2 top-1/2 h-5 w-[2px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-purple-300" />
      <span className="absolute left-1/2 top-1/2 h-5 w-[2px] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-purple-300" />
    </div>
  );
}