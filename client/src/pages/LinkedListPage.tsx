import { useEffect, useMemo } from "react";
import {
  generateLinkedListDemo,
  computeListStateAtStep,
} from "../engine-core/algorithms/linkedList";
import { LinkedListScene } from "../components/scene/LinkedListScene";
import { PlaybackControls } from "../components/playback/PlaybackControls";
import { AppShell } from "../components/layout/AppShell";
import { usePlaybackStore } from "../stores/playbackStore";
import {
  Activity,
  ArrowRight,
  CircleDot,
  GitBranch,
  Info,
  Network,
  RotateCcw,
} from "lucide-react";

export default function LinkedListPage() {
  const run = useMemo(() => generateLinkedListDemo(), []);

  const step = usePlaybackStore((s) => s.step);
  const setTotalSteps = usePlaybackStore((s) => s.setTotalSteps);
  const reset = usePlaybackStore((s) => s.reset);

  useEffect(() => {
    setTotalSteps(Math.max(run.events.length - 1, 0));
  }, [run, setTotalSteps]);

  const state = computeListStateAtStep(run.events, step);

  const totalSteps = Math.max(run.events.length - 1, 0);
  const progress =
    totalSteps > 0 ? Math.min((step / totalSteps) * 100, 100) : 0;

  const currentNode =
    state.traversing !== null ? state.nodes[state.traversing] : null;

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
                <GitBranch size={15} className="text-purple-300" />
              </div>

              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-purple-300/70">
                Data structure visualization
              </span>
            </div>

            <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
              Singly linked list.
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/45">
              Follow how nodes connect, how traversal moves through the list,
              and how each pointer relationship forms the structure.
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
            <div className="relative h-[500px] sm:h-[560px] lg:h-[600px]">
              <LinkedListScene
                nodes={state.nodes}
                traversing={state.traversing}
              />

              {/* Current operation indicator */}
              <div className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[10px] text-white/40 backdrop-blur-md">
                <Activity size={12} className="text-purple-300" />

                {currentNode ? (
                  <>
                    Traversing node{" "}
                    <span className="font-medium text-purple-300">
                      {currentNode.value}
                    </span>
                  </>
                ) : (
                  "Ready for traversal"
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
                  <Network size={15} className="text-purple-300" />
                </div>

                <div>
                  <p className="text-sm font-medium">Structure overview</p>
                  <p className="text-[10px] text-white/30">
                    Current linked list state
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
                  <span className="text-xs text-white/40">Nodes</span>

                  <span className="text-sm font-medium text-white/80">
                    {state.nodes.length}
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
                  <span className="text-xs text-white/40">Traversal</span>

                  <span className="text-sm font-medium text-purple-300">
                    {state.traversing !== null
                      ? `Node ${state.traversing}`
                      : "Idle"}
                  </span>
                </div>
              </div>
            </section>

            {/* Legend */}
            <section className="rounded-2xl border border-white/10 bg-[#0b0b0e]/90 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Info size={15} className="text-white/40" />

                <span className="text-sm font-medium">
                  Visualization guide
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-purple-400 shadow-lg shadow-purple-500/30" />

                  <span className="text-xs text-white/45">
                    Linked list node
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-orange-400 shadow-lg shadow-orange-500/30" />

                  <span className="text-xs text-white/45">
                    Currently traversing
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <ArrowRight size={14} className="text-white/30" />

                  <span className="text-xs text-white/45">
                    Next pointer
                  </span>
                </div>
              </div>
            </section>

            {/* Algorithm Insight */}
            <section className="flex-1 rounded-2xl border border-purple-400/15 bg-purple-500/[0.045] p-5">
              <div className="mb-4 flex items-center gap-2">
                <CircleDot size={15} className="text-purple-300" />

                <span className="text-xs font-medium uppercase tracking-[0.14em] text-purple-300/80">
                  Core concept
                </span>
              </div>

              <p className="text-sm leading-7 text-white/55">
                A linked list stores data in individual nodes. Each node
                contains a value and a reference to the next node, allowing
                traversal to move sequentially through the structure.
              </p>

              <div className="mt-5 border-t border-purple-400/10 pt-4">
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/25">
                  Complexity
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
                    <p className="text-[10px] text-white/30">
                      Traversal
                    </p>

                    <p className="mt-1 font-mono text-sm text-purple-300">
                      O(n)
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
                    <p className="text-[10px] text-white/30">
                      Access
                    </p>

                    <p className="mt-1 font-mono text-sm text-purple-300">
                      O(n)
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
            Tip: Use the playback controls to inspect traversal frame by
            frame.
          </span>

          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
            Linked list engine ready
          </span>
        </div>
      </div>
    </AppShell>
  );
}