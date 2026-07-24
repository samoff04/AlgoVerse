import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../stores/authStore";
import { api } from "../lib/api";
import { fetchMe } from "../lib/auth";
import { AppShell } from "../components/layout/AppShell";
import { Swords } from "lucide-react";
import {
  Binary,
  Target,
  Trophy,
  ArrowUpRight,
  Sparkles,
  Flame,
  Zap,
  TrendingUp,
  Play,
  ChevronRight,
  BrainCircuit,
  Clock3,
  Activity,
} from "lucide-react";

const modules = [
  {
    to: "/learn/bubble-sort",
    title: "Sorting algorithms",
    desc: "Explore algorithms in 3D",
    icon: Binary,
    tag: "LEARN",
  },
  {
    to: "/interview",
    title: "Interview mode",
    desc: "Think under pressure",
    icon: Trophy,
    tag: "PRACTICE",
  },
  {
    to: "/playground",
    title: "Complexity playground",
    desc: "Analyze code complexity",
    icon: Target,
    tag: "ANALYZE",
  },
  {
    to: "/visualize",
    title: "Visualize my code",
    desc: "Turn logic into motion",
    icon: Sparkles,
    tag: "CREATE",
  },
  {
    to: "/contest",
    title: "Live contests",
    desc: "Compete in real time",
    icon: Swords,
    tag: "COMPETE",
  },
];

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 5) return "Working late, ";
  if (hour < 12) return "Good morning, ";
  if (hour < 17) return "Good afternoon, ";
  if (hour < 21) return "Good evening, ";

  return "Good night, ";
}

function getInitials(name?: string) {
  if (!name) return "U";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  color,
  delay,
}: {
  icon: typeof Flame;
  label: string;
  value: number;
  suffix: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/20 hover:bg-white/[0.045]"
    >
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl opacity-20 transition duration-500 group-hover:opacity-40 ${color}`}
      />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/40">
            <Icon size={14} />
            <span className="text-[10px] font-medium uppercase tracking-widest">
              {label}
            </span>
          </div>

          <Activity size={13} className="text-white/20" />
        </div>

        <p className="text-3xl font-medium tracking-tight">
          {value}
          <span className="ml-1 text-sm font-normal text-white/35">
            {suffix}
          </span>
        </p>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [progress, setProgress] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loadingRec, setLoadingRec] = useState(true);

  useEffect(() => {
    api.get("/progress").then((res) => setProgress(res.data.progress));

    api.get("/progress/recent").then((res) => setRecent(res.data.recent));

    api
      .get("/recommend")
      .then((res) => setRecommendation(res.data.recommendation))
      .finally(() => setLoadingRec(false));

    fetchMe().then(setUser).catch(() => {});
  }, [setUser]);

  const avgMastery = progress.length
    ? Math.round(
        (progress.reduce((sum, p) => sum + p.masteryScore, 0) /
          progress.length) *
          100,
      )
    : 0;

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <AppShell>
      <div className="relative mx-auto max-w-7xl overflow-hidden px-6 py-8 lg:px-10">
        {/* Ambient background */}
        <div className="pointer-events-none absolute left-1/2 top-[-250px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/[0.07] blur-[140px]" />

        <div className="pointer-events-none absolute right-[-200px] top-[400px] h-[500px] w-[500px] rounded-full bg-indigo-600/[0.04] blur-[140px]" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-400/20 bg-purple-500/10 text-xs font-medium text-purple-300">
                {getInitials(user?.name)}
              </div>

              <span className="text-xs text-white/30">
                Personal workspace
              </span>
            </div>

            <h1 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
              {getGreeting()}
              <span className="text-white/50">{firstName}.</span>
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Your next breakthrough is one problem away.
            </p>
          </div>

          <Link
            to="/learn/bubble-sort"
            className="group flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white/60 transition hover:border-purple-400/30 hover:bg-purple-500/[0.08] hover:text-white"
          >
            <Play size={13} fill="currentColor" />
            Continue learning
            <ArrowUpRight
              size={13}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="relative mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            icon={Flame}
            label="Streak"
            value={user?.streak ?? 0}
            suffix="days"
            color="bg-orange-400"
            delay={0.1}
          />

          <StatCard
            icon={Zap}
            label="Experience"
            value={user?.xp ?? 0}
            suffix="XP"
            color="bg-yellow-400"
            delay={0.2}
          />

          <StatCard
            icon={TrendingUp}
            label="Average mastery"
            value={avgMastery}
            suffix="%"
            color="bg-purple-400"
            delay={0.3}
          />
        </div>

        {/* AI Mission */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="group relative mb-10 overflow-hidden rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-500/[0.12] via-purple-500/[0.04] to-transparent p-6 sm:p-7"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px] transition group-hover:bg-purple-500/20" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-400/20 bg-purple-500/10">
                  <BrainCircuit size={15} className="text-purple-300" />
                </div>

                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-purple-300/80">
                  AI learning intelligence
                </span>
              </div>

              <h2 className="mb-2 text-lg font-medium">
                Your next recommended move
              </h2>

              {loadingRec ? (
                <div className="flex gap-1.5 py-2">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-300/50" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-300/50 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-300/50 [animation-delay:300ms]" />
                </div>
              ) : (
                <p className="max-w-xl text-sm leading-6 text-white/55">
                  {recommendation}
                </p>
              )}
            </div>

            <Link
              to="/learn/bubble-sort"
              className="group/btn flex shrink-0 items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2.5 text-xs text-purple-200 transition hover:bg-purple-500/20"
            >
              Follow recommendation
              <ChevronRight
                size={14}
                className="transition-transform group-hover/btn:translate-x-1"
              />
            </Link>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Progress */}
          <motion.section
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
                  Learning activity
                </p>

                <h2 className="text-xl font-medium tracking-tight">
                  Your progress
                </h2>
              </div>

              <span className="text-xs text-white/30">
                {progress.length} algorithms
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
              {progress.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                    <Target size={19} className="text-white/30" />
                  </div>

                  <p className="text-sm text-white/40">
                    Nothing tracked yet.
                  </p>

                  <p className="mt-1 text-xs text-white/25">
                    Complete an algorithm to start building your learning map.
                  </p>
                </div>
              ) : (
                progress.map((p, i) => {
                  const mastery = Math.round(p.masteryScore * 100);

                  return (
                    <motion.div
                      key={p.algorithmSlug}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.08 }}
                      className={`group flex items-center justify-between gap-4 px-5 py-4 ${
                        i !== 0 ? "border-t border-white/5" : ""
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-300">
                          <Binary size={14} />
                        </div>

                        <span className="truncate text-sm text-white/70 transition group-hover:text-white">
                          {p.algorithmSlug}
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <div className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-white/10 sm:block">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${mastery}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-300"
                          />
                        </div>

                        <span className="w-9 text-right text-xs text-white/45">
                          {mastery}%
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.section>

          {/* Recent Activity */}
          <motion.section
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
                  Timeline
                </p>

                <h2 className="text-xl font-medium tracking-tight">
                  Recent activity
                </h2>
              </div>

              <Clock3 size={15} className="text-white/25" />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              {recent.length === 0 ? (
                <p className="py-8 text-center text-sm text-white/35">
                  Your activity will appear here.
                </p>
              ) : (
                <div className="space-y-5">
                  {recent.slice(0, 5).map((r, i) => (
                    <div key={r._id} className="flex gap-3">
                      <div className="relative">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-purple-400/20 bg-purple-500/10">
                          <Zap size={12} className="text-purple-300" />
                        </div>

                        {i !== recent.slice(0, 5).length - 1 && (
                          <div className="absolute left-1/2 top-8 h-6 w-px -translate-x-1/2 bg-white/10" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm text-white/65">
                          Completed{" "}
                          <span className="text-white/90">
                            {r.algorithmSlug}
                          </span>
                        </p>

                        <p className="mt-1 text-[10px] text-white/25">
                          {new Date(r.lastReviewed).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        </div>

        {/* Modules */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-12"
        >
          <div className="mb-5">
            <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
              Explore the platform
            </p>

            <h2 className="text-xl font-medium tracking-tight">
              Choose your next move
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {modules.map((module, index) => {
              const Icon = module.icon;

              return (
                <Link
                  key={module.to}
                  to={module.to}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-purple-400/20 hover:bg-white/[0.05]"
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-purple-500/[0.05] blur-2xl transition group-hover:bg-purple-500/[0.12]" />

                  <div className="relative">
                    <div className="mb-7 flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-purple-300">
                        <Icon size={16} />
                      </div>

                      <ArrowUpRight
                        size={14}
                        className="text-white/20 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/70"
                      />
                    </div>

                    <p className="mb-2 text-[9px] font-medium tracking-[0.2em] text-purple-300/60">
                      {module.tag}
                    </p>

                    <p className="text-sm font-medium text-white/80">
                      {module.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/35">
                      {module.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.section>
      </div>
    </AppShell>
  );
}