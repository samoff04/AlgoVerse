import { useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getAlgorithm } from "../algorithms/registry";
import { computeVisualState, computeStats } from "../engine-core/replay";
import { ArrayScene } from "../components/scene/ArrayScene";
import { PlaybackControls } from "../components/playback/PlaybackControls";
import { CodePanel } from "../components/editor/CodePanel";
import { AppShell } from "../components/layout/AppShell";
import { usePlaybackStore } from "../stores/playbackStore";
import { useAuthStore } from "../stores/authStore";
import { api } from "../lib/api";
import {
  ArrowLeft,
  GitCompare,
  Shuffle,
  CheckCircle2,
  Activity,
  Sparkles,
  Circle,
  Clock3,
  Layers3,
} from "lucide-react";

export default function AlgorithmPage() {
  const { algoId } = useParams<{ algoId: string }>();
  const navigate = useNavigate();

  const algo = getAlgorithm(algoId as string);

  const run = useMemo(
    () => (algo ? algo.generate(algo.defaultInput) : null),
    [algo],
  );

  const step = usePlaybackStore((s) => s.step);
  const setTotalSteps = usePlaybackStore((s) => s.setTotalSteps);

  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);

  const hasSaved = useRef(false);

  useEffect(() => {
    if (run) {
      setTotalSteps(run.events.length - 1);
      hasSaved.current = false;
    }
  }, [run, setTotalSteps]);

  useEffect(() => {
    if (!run || !algo || !user || hasSaved.current) return;

    if (step >= run.events.length - 1) {
      hasSaved.current = true;

      api
        .post("/progress", {
          algorithmSlug: algo.slug,
          masteryScore: 1,
        })
        .then((res) => {
          if (res.data.user) {
            setUser(res.data.user);
          }
        })
        .catch(() => {});
    }
  }, [step, run, algo, user, setUser]);

  if (!algo || !run) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center text-white/50">
          Algorithm not found.
        </div>
      </AppShell>
    );
  }

  const state = computeVisualState(run, step);
  const stats = computeStats(run, step);

  const currentEvent = run.events[Math.min(step, run.events.length - 1)];

  const isDone = step >= run.events.length - 1;

  const progress =
    run.events.length > 1
      ? Math.round((step / (run.events.length - 1)) * 100)
      : 0;

  const opLabel = isDone
    ? "Execution complete — every element is in its final position."
    : currentEvent?.type === "compare"
      ? `Comparing indices ${currentEvent.indices[0]} and ${currentEvent.indices[1]}`
      : currentEvent?.type === "swap"
        ? `Swapping indices ${currentEvent.indices[0]} and ${currentEvent.indices[1]}`
        : currentEvent?.type === "set"
          ? `Writing merged value at index ${currentEvent.index}`
          : currentEvent?.type === "sorted"
            ? `Index ${currentEvent.index} locked into place`
            : "Ready to begin execution";

  return (
    <AppShell>
      <div className="relative min-h-screen overflow-hidden">
        {/* Ambient background */}
        <div className="pointer-events-none absolute left-1/2 top-[-250px] h-[600px] w-[700px] -translate-x-1/2 rounded-full bg-purple-600/[0.06] blur-[150px]" />

        <div className="pointer-events-none absolute bottom-[-200px] right-[-150px] h-[500px] w-[500px] rounded-full bg-indigo-600/[0.04] blur-[140px]" />

        <div className="relative mx-auto max-w-[1500px] px-6 py-6 lg:px-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => navigate(-1)}
              className="group mb-6 flex items-center gap-2 text-xs text-white/35 transition hover:text-white"
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-1"
              />
              Back to workspace
            </button>

            <div className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-purple-300">
                    {algo.category}
                  </span>

                  <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-white/25">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Interactive runtime
                  </span>
                </div>

                <h1 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
                  {algo.title}
                </h1>

                <p className="mt-2 max-w-xl text-sm text-white/40">
                  Explore the algorithm step by step. Every operation is
                  synchronized with the visual state and source code.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Metric
                  icon={GitCompare}
                  value={stats.comparisons}
                  label="compares"
                  iconClass="text-orange-300"
                />

                <Metric
                  icon={Shuffle}
                  value={stats.swaps}
                  label="writes"
                  iconClass="text-purple-300"
                />

                <AnimatePresence mode="wait">
                  {isDone && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, x: 10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300"
                    >
                      <CheckCircle2 size={13} />
                      Complete
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Execution status */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative mb-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"
          >
            <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <motion.div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isDone
                      ? "bg-emerald-500/10 text-emerald-300"
                      : "bg-purple-500/10 text-purple-300"
                  }`}
                  animate={
                    !isDone
                      ? {
                          scale: [1, 1.06, 1],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  {isDone ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <Activity size={15} />
                  )}
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={opLabel}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="truncate text-sm text-white/65"
                  >
                    {opLabel}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-white/25">
                  Step {step} / {run.events.length - 1}
                </span>

                <span className="text-xs font-medium text-purple-300">
                  {progress}%
                </span>
              </div>
            </div>

            <div className="h-[2px] bg-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 via-purple-400 to-indigo-300"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Main workspace */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_430px]">
            {/* Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] shadow-2xl shadow-black/20 transition hover:border-white/15"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-400/15 bg-purple-500/10">
                    <Layers3 size={15} className="text-purple-300" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">Visual execution</p>
                    <p className="text-[10px] text-white/30">
                      Live algorithm state
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/25">
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-purple-400"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                    }}
                  />
                  Frame {step}
                </div>
              </div>

              {/* Scene */}
              <div className="relative h-[440px] overflow-hidden">
                <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(5,5,7,0.25)_100%)]" />

                <ArrayScene state={state} />
              </div>

              {/* Controls */}
              <div className="border-t border-white/10 bg-black/10">
                <PlaybackControls />
              </div>
            </motion.div>

            {/* Code panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="overflow-hidden rounded-3xl border border-white/10 bg-[#09090c] shadow-2xl shadow-black/20 transition hover:border-white/15"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                    <CodeIcon />
                  </div>

                  <div>
                    <p className="text-sm font-medium">Source code</p>
                    <p className="text-[10px] text-white/30">
                      Synchronized execution
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-white/25">
                  <Circle size={7} fill="currentColor" />
                  LIVE
                </div>
              </div>

              <div className="h-[440px]">
                <CodePanel
                  source={algo.source}
                  activeLine={state.activeLine}
                />
              </div>

              <div className="border-t border-white/10 px-5 py-3">
                <div className="flex items-center gap-2 text-[10px] text-white/25">
                  <Clock3 size={12} />
                  Current execution frame synchronized
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom intelligence strip */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            <InfoCard
              icon={Sparkles}
              label="Current insight"
              value={
                isDone
                  ? "The algorithm has completed execution."
                  : "Every visual state maps directly to a code operation."
              }
            />

            <InfoCard
              icon={GitCompare}
              label="Operations"
              value={`${stats.comparisons} comparisons recorded during execution.`}
            />

            <InfoCard
              icon={Activity}
              label="Runtime state"
              value={
                isDone
                  ? "Execution successfully completed."
                  : "The algorithm is currently being explored."
              }
            />
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}

function Metric({
  icon: Icon,
  value,
  label,
  iconClass,
}: {
  icon: typeof GitCompare;
  value: number;
  label: string;
  iconClass: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/50"
    >
      <Icon size={13} className={iconClass} />
      <span className="font-medium text-white/80">{value}</span>
      {label}
    </motion.div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Sparkles;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-2 flex items-center gap-2 text-white/30">
        <Icon size={13} className="text-purple-300/70" />
        <span className="text-[10px] font-medium uppercase tracking-widest">
          {label}
        </span>
      </div>

      <p className="text-xs leading-5 text-white/45">{value}</p>
    </div>
  );
}

function CodeIcon() {
  return (
    <span className="font-mono text-xs text-purple-300">
      {"</>"}
    </span>
  );
}