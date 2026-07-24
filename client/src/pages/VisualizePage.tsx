import { useEffect, useRef, useState } from "react";

import { runUserCode } from "../lib/runUserCode";
import {
  runUniversalCode,
  type StructureType,
} from "../lib/runUniversalCode";

import { detectStructureType } from "../lib/detectStructureType";

import {
  structureTemplates,
  type Language,
  languageMeta,
} from "../lib/structureTemplates";

import { computeVisualState } from "../engine-core/replay";

import { ArrayScene } from "../components/scene/ArrayScene";
import { StackScene } from "../components/scene/StackScene";
import { LinkedListScene } from "../components/scene/LinkedListScene";
import { TreeScene } from "../components/scene/TreeScene";
import { PlaybackControls } from "../components/playback/PlaybackControls";

import { usePlaybackStore } from "../stores/playbackStore";
import { AppShell } from "../components/layout/AppShell";

import { api } from "../lib/api";
import { Button } from "@/components/ui/button";

import {
  Sparkles,
  Play,
  Wand2,
  Code2,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { useAuthStore } from "../stores/authStore";

const typeOrder: StructureType[] = [
  "array",
  "stack",
  "list",
  "tree",
];

const languageOrder: Language[] = [
  "javascript",
  "python",
  "java",
  "cpp",
];

export default function VisualizePage() {
  const [type, setType] =
    useState<StructureType>("array");

  const [language, setLanguage] =
    useState<Language>("javascript");

  const [code, setCode] = useState(
    structureTemplates.array.code.javascript
  );

  const [input, setInput] = useState(
    "8, 3, 6, 1, 9, 4"
  );

  const [suggested, setSuggested] =
    useState<StructureType | null>(null);

  const [arrayRun, setArrayRun] = useState<
    ReturnType<typeof runUserCode> | null
  >(null);

  const [universalRun, setUniversalRun] = useState<
    ReturnType<typeof runUniversalCode> | null
  >(null);

  const [explanation, setExplanation] =
    useState<string | null>(null);

  const [explaining, setExplaining] =
    useState(false);

  const step = usePlaybackStore(
    (state) => state.step
  );

  const setTotalSteps = usePlaybackStore(
    (state) => state.setTotalSteps
  );

  const resetPlayback = usePlaybackStore(
    (state) => state.reset
  );

  const setUser = useAuthStore(
    (state) => state.setUser
  );

  const hasAwarded = useRef(false);

  /*
   * Detect when the user writes code that
   * appears to belong to another structure.
   */
  useEffect(() => {
    if (code.trim().length < 20) {
      setSuggested(null);
      return;
    }

    const guess = detectStructureType(code);

    setSuggested(
      guess !== type ? guess : null
    );
  }, [code, type]);

  /*
   * Parse array input safely.
   */
  function parseInput(value: string) {
    return value
      .split(",")
      .map((value) =>
        parseInt(value.trim(), 10)
      )
      .filter(
        (value) => !Number.isNaN(value)
      );
  }

  /*
   * Clear current visualization.
   */
  function clearVisualization() {
    setArrayRun(null);
    setUniversalRun(null);
    setExplanation(null);
    setSuggested(null);

    hasAwarded.current = false;

    resetPlayback();
  }

  /*
   * Change data structure.
   */
  function handleTypeChange(
    next: StructureType
  ) {
    setType(next);

    setCode(
      structureTemplates[next].code[language]
    );

    setInput(
      next === "array"
        ? "8, 3, 6, 1, 9, 4"
        : ""
    );

    clearVisualization();
  }

  /*
   * Change programming language.
   */
  function handleLanguageChange(
    next: Language
  ) {
    setLanguage(next);

    setCode(
      structureTemplates[type].code[next]
    );

    clearVisualization();
  }

  /*
   * Reset current editor.
   */
  function handleReset() {
    setCode(
      structureTemplates[type].code[language]
    );

    setInput(
      type === "array"
        ? "8, 3, 6, 1, 9, 4"
        : ""
    );

    clearVisualization();
  }

  /*
   * Run the user's algorithm.
   */
  function handleRun() {
    setExplanation(null);

    resetPlayback();

    /*
     * Currently only JavaScript can be
     * executed directly in the browser.
     */
    if (language !== "javascript") {
      setArrayRun(null);
      setUniversalRun(null);

      setTotalSteps(0);

      setExplanation(
        `${languageMeta[language].label} execution is not connected yet. Visualization currently executes JavaScript code directly in the browser.`
      );

      return;
    }

    const functionName =
      structureTemplates[type].functionName;

    /*
     * ARRAY
     */
    if (type === "array") {
      const testInput =
        parseInput(input);

      if (testInput.length === 0) {
        setExplanation(
          "Please enter at least one valid number."
        );

        return;
      }

      const result = runUserCode(
        code,
        functionName,
        testInput
      );

      setArrayRun(result);
      setUniversalRun(null);

      setTotalSteps(
        Math.max(
          result.events.length - 1,
          0
        )
      );

      awardIfNeeded(result.success);

      return;
    }

    /*
     * STACK / LINKED LIST / TREE
     */
    const result = runUniversalCode(
      code,
      functionName,
      type
    );

    setUniversalRun(result);
    setArrayRun(null);

    setTotalSteps(
      Math.max(
        result.snapshots.length - 1,
        0
      )
    );

    awardIfNeeded(result.success);
  }

  /*
   * Award progress after successful execution.
   */
  function awardIfNeeded(
    success: boolean
  ) {
    if (
      !success ||
      hasAwarded.current
    ) {
      return;
    }

    hasAwarded.current = true;

    api
      .post("/progress", {
        algorithmSlug:
          `custom:${type}:${structureTemplates[type].functionName}`,

        masteryScore: 0.5,
      })
      .then((response) => {
        if (response.data.user) {
          setUser(response.data.user);
        }
      })
      .catch(() => {});
  }

  /*
   * AI explanation.
   */
  async function handleExplain() {
    const hasResult =
      type === "array"
        ? !!arrayRun
        : !!universalRun;

    if (!hasResult) {
      return;
    }

    setExplaining(true);

    try {
      const { data } =
        await api.post(
          "/tutor",
          {
            messages: [
              {
                role: "user",

                content: `Explain what this ${structureTemplates[
                  type
                ].label.toLowerCase()} algorithm does, how it works step by step, and its time and space complexity.

Language: ${languageMeta[language].label}

\`\`\`${languageMeta[language].extension}
${code}
\`\`\``,
              },
            ],
          }
        );

      setExplanation(data.answer);
    } catch {
      setExplanation(
        "Couldn't reach the AI tutor just now."
      );
    } finally {
      setExplaining(false);
    }
  }

  /*
   * Array visualization state.
   */
  const testInputArr =
    parseInput(input);

  const arrayState =
    arrayRun
      ? computeVisualState(
          {
            initialArray:
              testInputArr,

            events:
              arrayRun.events,

            codeLineMap: {},
          },

          step
        )
      : null;

  /*
   * Universal visualization state.
   */
  const universalSnapshot =
    universalRun &&
    universalRun.snapshots.length > 0
      ? universalRun.snapshots[
          Math.min(
            step,
            universalRun.snapshots.length - 1
          )
        ]
      : null;

  const hasResult =
    type === "array"
      ? !!arrayRun
      : !!universalRun;

  const runError =
    type === "array"
      ? arrayRun &&
        !arrayRun.success
        ? arrayRun.error
        : null
      : universalRun &&
        !universalRun.success
        ? universalRun.error
        : null;

  /*
   * Render the correct visualization.
   */
  function renderScene() {
    if (
      type === "array" &&
      arrayState
    ) {
      return (
        <ArrayScene
          state={arrayState}
        />
      );
    }

    if (
      type === "stack" &&
      universalSnapshot
    ) {
      return (
        <StackScene
          stack={
            universalSnapshot.stack
          }
        />
      );
    }

    if (
      type === "list" &&
      universalSnapshot
    ) {
      return (
        <LinkedListScene
          nodes={
            universalSnapshot.nodes
          }
          traversing={
            universalSnapshot.traversing
          }
        />
      );
    }

    if (
      type === "tree" &&
      universalSnapshot
    ) {
      return (
        <TreeScene
          nodes={
            universalSnapshot.nodes
          }
          rootId={
            universalSnapshot.rootId
          }
          activeNodeId={
            universalSnapshot.activeNodeId
          }
        />
      );
    }

    return (
      <div className="flex h-[500px] items-center justify-center text-sm text-white/30">
        Run your code to see it visualized here
      </div>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-6">

        {/* HEADER */}

        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <Code2
              size={16}
              className="text-purple-300"
            />

            <span className="text-xs font-medium uppercase tracking-[0.16em] text-purple-300/70">
              Universal algorithm visualizer
            </span>
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-medium tracking-tight">
                Visualize your code.
              </h1>

              <p className="mt-2 text-sm text-white/45">
                Write algorithms for arrays,
                stacks, linked lists, and trees —
                then watch every mutation become
                an interactive visual state.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={handleReset}
              className="w-fit gap-2 border-white/10 bg-white/[0.03] text-xs text-white/60 hover:bg-white/[0.07] hover:text-white"
            >
              <RotateCcw size={13} />
              Reset
            </Button>
          </div>
        </div>

        {/* STRUCTURE SELECTOR */}

        <div className="mb-4 flex flex-wrap gap-2">
          {typeOrder.map((structure) => (
            <button
              key={structure}
              onClick={() =>
                handleTypeChange(
                  structure
                )
              }
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                type === structure
                  ? "bg-purple-500/20 text-purple-200"
                  : "border border-white/10 text-white/50 hover:text-white"
              }`}
            >
              {
                structureTemplates[
                  structure
                ].label
              }
            </button>
          ))}
        </div>

        {/* LANGUAGE SELECTOR */}

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs text-white/35">
            Language
          </span>

          {languageOrder.map((lang) => (
            <button
              key={lang}
              onClick={() =>
                handleLanguageChange(
                  lang
                )
              }
              className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                language === lang
                  ? "border-purple-400/30 bg-purple-500/15 text-purple-200"
                  : "border-white/10 text-white/45 hover:border-white/20 hover:text-white"
              }`}
            >
              {
                languageMeta[lang]
                  .label
              }
            </button>
          ))}
        </div>

        {/* SMART SUGGESTION */}

        {suggested && (
          <button
            onClick={() =>
              handleTypeChange(
                suggested
              )
            }
            className="mb-4 flex items-center gap-2 rounded-lg border border-purple-400/20 bg-purple-500/[0.06] px-3 py-2 text-xs text-purple-200 transition hover:bg-purple-500/10"
          >
            <Wand2 size={13} />

            This looks like{" "}
            {
              structureTemplates[
                suggested
              ].label.toLowerCase()
            }{" "}
            code — switch to that mode?
          </button>
        )}

        {/* MAIN WORKSPACE */}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_1fr]">

          {/* CODE PANEL */}

          <div className="space-y-3">

            <div className="flex items-start justify-between gap-3">
              <p className="text-xs leading-relaxed text-white/40">
                {
                  structureTemplates[
                    type
                  ].hint
                }
              </p>

              <span className="shrink-0 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-white/40">
                {
                  languageMeta[
                    language
                  ].label
                }
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <textarea
                value={code}
                onChange={(event) =>
                  setCode(
                    event.target.value
                  )
                }
                spellCheck={false}
                className="h-96 w-full resize-none bg-[#0a0a0c] p-4 font-mono text-[13px] leading-relaxed text-white/85 outline-none"
                placeholder="// Write your algorithm here..."
              />
            </div>

            {/* ARRAY INPUT */}

            {type === "array" && (
              <input
                value={input}
                onChange={(event) =>
                  setInput(
                    event.target.value
                  )
                }
                placeholder="8, 3, 6, 1"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none transition focus:border-purple-400/40"
              />
            )}

            {/* ACTIONS */}

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleRun}
                className="gap-2 bg-purple-600 hover:bg-purple-500"
              >
                <Play
                  size={14}
                  fill="currentColor"
                />

                Run and visualize
              </Button>

              <Button
                variant="outline"
                onClick={handleExplain}
                disabled={
                  !hasResult ||
                  explaining
                }
                className="gap-2 border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.07]"
              >
                <Sparkles
                  size={14}
                  className="text-purple-300"
                />

                {explaining
                  ? "Thinking..."
                  : "AI explain"}
              </Button>
            </div>

            {/* EXECUTION ERROR */}

            {runError && (
              <div className="flex items-start gap-2 rounded-lg border border-red-400/20 bg-red-500/[0.05] p-3 text-xs text-red-400">
                <AlertCircle
                  size={14}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  {runError}
                </span>
              </div>
            )}

            {/* EXPLANATION */}

            {explanation && (
              <div className="rounded-lg border border-purple-400/20 bg-purple-500/[0.05] p-3 text-xs leading-relaxed text-white/80">
                {explanation}
              </div>
            )}
          </div>

          {/* VISUALIZATION PANEL */}

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">

            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />

                <span className="text-xs font-medium text-white/70">
                  Live visualization
                </span>
              </div>

              {hasResult &&
                !runError && (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-300/80">
                    <CheckCircle2
                      size={12}
                    />

                    Execution complete
                  </div>
                )}
            </div>

            <div className="h-[440px]">
              {renderScene()}
            </div>

            {hasResult && (
              <div className="border-t border-white/10">
                <PlaybackControls />
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/25">
          <span>
            Tip: Use the playback controls to inspect every state transition frame by frame.
          </span>

          <span>
            JavaScript visualization is currently active.
          </span>
        </div>
      </div>
    </AppShell>
  );
}