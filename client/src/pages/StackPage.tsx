import { useEffect, useMemo } from "react";
import {
  generateStackDemo,
  computeStackStateAtStep,
} from "../engine-core/algorithms/stack";
import { StackScene } from "../components/scene/StackScene";
import { PlaybackControls } from "../components/playback/PlaybackControls";
import { AppShell } from "../components/layout/AppShell";
import { usePlaybackStore } from "../stores/playbackStore";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  CircleDot,
  Info,
  Layers3,
  RotateCcw,
} from "lucide-react";

export default function StackPage() {
  const run = useMemo(() => generateStackDemo(), []);

  const step = usePlaybackStore((s) => s.step);
  const setTotalSteps = usePlaybackStore((s) => s.setTotalSteps);
  const reset = usePlaybackStore((s) => s.reset);

  useEffect(() => {
    setTotalSteps(Math.max(run.events.length - 1, 0));
  }, [run, setTotalSteps]);

  const state = computeStackStateAtStep(run.events, step);

  const totalSteps = Math.max(run.events.length - 1, 0);

  const progress =
    totalSteps > 0 ? Math.min((step / totalSteps) * 100, 100) : 0;

  const topValue =
    state.stack.length > 0
      ? state.stack[state.stack.length - 1].value
      : null;

  function handleReset() {
    reset();
  }

  return (
    <AppShell>
      <div className="relative mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[10%] top-0 h-80 w-80 rounded-full bg-purple-500/[0.045] blur-3xl" />

          <div className="absolute right-[8%] top-[30%] h-96 w-96 rounded-full bg-blue-500/[0.035] blur-3xl" />
        </div>

        {/* Header */}
        <header className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-400/20 bg-purple-500/10">
                <Layers3 size={15} className="text-purple-300" />
              </div>

              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-purple-300/70">
                Data structure visualization
              </span>
            </div>

            <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
              Stack.
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/45">
              Explore the LIFO principle through animated push and pop
              operations, with the top element always visible.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/[0.07] px-3 py-1.5 text-xs text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Simulation ready
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/50 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </header>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* Visualization */}
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#09090c] shadow-2xl shadow-black/20">
            {/* Visualization Header */}
            <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-purple-400 shadow-lg shadow-purple-500/50" />

                  <span className="text-sm font-medium">
                    Live visualization
                  </span>
                </div>

                <p className="mt-1 text-[11px] text-white/35">
                  Frame {Math.min(step + 1, totalSteps + 1)} of{" "}
                  {totalSteps + 1}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-white/35">
                  {Math.round(progress)}% explored
                </span>

                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-purple-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Scene */}
            <div className="relative h-[520px] sm:h-[580px] lg:h-[620px]">
              <StackScene stack={state.stack} />

              {/* Stack top indicator */}
              <div className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[10px] text-white/40 backdrop-blur-md">
                <Activity size={12} className="text-purple-300" />

                {topValue !== null ? (
                  <>
                    Top element{" "}
                    <span className="font-medium text-purple-300">
                      {topValue}
                    </span>
                  </>
                ) : (
                  "Stack is empty"
                )}
              </div>
            </div>

            {/* Playback */}
            <div className="border-t border-white/10">
              <PlaybackControls />
            </div>
          </section>

          {/* Information Panel */}
          <aside className="flex flex-col gap-4">
            {/* Structure Overview */}
            <section className="rounded-2xl border border-white/10 bg-[#0b0b0e]/90 p-5">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-400/20 bg-purple-500/10">
                  <Layers3 size={15} className="text-purple-300" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Structure overview
                  </p>

                  <p className="text-[10px] text-white/30">
                    Current stack state
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
                  <span className="text-xs text-white/40">
                    Elements
                  </span>

                  <span className="text-sm font-medium text-white/80">
                    {state.stack.length}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
                  <span className="text-xs text-white/40">
                    Current step
                  </span>

                  <span className="text-sm font-medium text-white/80">
                    {step}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
                  <span className="text-xs text-white/40">
                    Top
                  </span>

                  <span className="text-sm font-medium text-purple-300">
                    {topValue ?? "Empty"}
                  </span>
                </div>
              </div>
            </section>

            {/* Operations */}
            <section className="rounded-2xl border border-white/10 bg-[#0b0b0e]/90 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Info size={15} className="text-white/40" />

                <span className="text-sm font-medium">
                  Stack operations
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/15 bg-emerald-500/[0.08]">
                    <ArrowUp size={14} className="text-emerald-300" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-white/70">
                      Push
                    </p>

                    <p className="text-[10px] text-white/30">
                      Add an element to the top
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-400/15 bg-orange-500/[0.08]">
                    <ArrowDown size={14} className="text-orange-300" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-white/70">
                      Pop
                    </p>

                    <p className="text-[10px] text-white/30">
                      Remove the top element
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Core Concept */}
            <section className="flex-1 rounded-2xl border border-purple-400/15 bg-purple-500/[0.045] p-5">
              <div className="mb-4 flex items-center gap-2">
                <CircleDot size={15} className="text-purple-300" />

                <span className="text-xs font-medium uppercase tracking-[0.14em] text-purple-300/80">
                  Core concept
                </span>
              </div>

              <p className="text-sm leading-7 text-white/55">
                A stack follows the LIFO principle: the last element pushed
                into the structure is the first element removed.
              </p>

              <div className="mt-5 border-t border-purple-400/10 pt-4">
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/25">
                  Complexity
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
                    <p className="text-[10px] text-white/30">
                      Push
                    </p>

                    <p className="mt-1 font-mono text-sm text-purple-300">
                      O(1)
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
                    <p className="text-[10px] text-white/30">
                      Pop
                    </p>

                    <p className="mt-1 font-mono text-sm text-purple-300">
                      O(1)
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {/* Footer Hint */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/25">
          <span>
            Tip: Watch how elements enter and leave exclusively from the top.
          </span>

          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
            Stack engine ready
          </span>
        </div>
      </div>
    </AppShell>
  );
}