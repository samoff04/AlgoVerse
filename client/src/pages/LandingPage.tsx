import { Link } from "react-router-dom";
import { HeroScene } from "../components/landing/HeroScene";
import { FloatingIcons } from "../components/landing/FloatingIcons";
import { Logo } from "../components/brand/Logo";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Box,
  BrainCircuit,
  Code2,
  GitBranch,
  Play,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Box,
    label: "VISUAL ENGINE",
    title: "Algorithms you can actually see.",
    desc: "Explore sorting, trees, graphs, and data structures through interactive 3D visualizations.",
  },
  {
    icon: BrainCircuit,
    label: "AI TUTOR",
    title: "Understand every decision.",
    desc: "Ask why a step happened and get an explanation grounded in the exact state of the algorithm.",
  },
  {
    icon: Code2,
    label: "CODE INTELLIGENCE",
    title: "From code to complexity.",
    desc: "Paste code in any language and receive an AI-reasoned breakdown of time and space complexity.",
  },
  {
    icon: Trophy,
    label: "INTERVIEW MODE",
    title: "Practice under pressure.",
    desc: "Simulate real technical interviews with an AI interviewer that challenges your reasoning.",
  },
];

const steps = [
  {
    step: "01",
    title: "Choose a problem",
    desc: "Select an algorithm, data structure, or interview challenge.",
  },
  {
    step: "02",
    title: "Watch it execute",
    desc: "Scrub through every operation and explore the structure in 3D.",
  },
  {
    step: "03",
    title: "Understand why",
    desc: "Ask the AI tutor questions about the exact step you're viewing.",
  },
];

const floatingNodes = [
  { label: "O(log n)", x: "8%", y: "22%", delay: 0 },
  { label: "BFS", x: "88%", y: "25%", delay: 1.2 },
  { label: "O(n²)", x: "5%", y: "66%", delay: 2 },
  { label: "DFS", x: "91%", y: "67%", delay: 0.8 },
];

function FloatingNode({
  label,
  x,
  y,
  delay,
}: {
  label: string;
  x: string;
  y: string;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-[10px] text-white/35 backdrop-blur-md lg:flex"
      style={{ left: x, top: y }}
      animate={{
        y: [0, -14, 0],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 5,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
      {label}
    </motion.div>
  );
}

function AlgorithmPreview() {
  return (
    <motion.div
      className="relative mx-auto mt-20 w-full max-w-5xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute -inset-10 bg-purple-500/10 blur-[100px]"
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0f]/90 shadow-2xl shadow-purple-950/30 backdrop-blur-2xl"
        whileHover={{
          y: -6,
          rotateX: 1,
          rotateY: -1,
        }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            </div>

            <span className="ml-2 text-xs text-white/40">
              algorithm / binary-search
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-emerald-400/80">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
              }}
            />
            Live execution
          </div>
        </div>

        <div className="grid min-h-[360px] grid-cols-1 md:grid-cols-[0.8fr_1.4fr_0.8fr]">
          <div className="border-b border-white/10 p-6 md:border-b-0 md:border-r">
            <div className="mb-5 flex items-center gap-2 text-xs text-white/40">
              <Code2 size={14} />
              source.py
            </div>

            <div className="space-y-2 font-mono text-[11px] leading-relaxed">
              <p className="text-white/25">01</p>

              <p className="text-white/60">
                <span className="text-purple-300">def</span>{" "}
                binary_search(arr, target):
              </p>

              <p className="text-white/35">02</p>

              <p className="pl-4 text-white/50">
                left, right = 0, len(arr) - 1
              </p>

              <p className="text-white/35">03</p>

              <p className="pl-4 text-white/50">
                <span className="text-purple-300">while</span> left &lt;= right:
              </p>

              <motion.p
                className="rounded bg-purple-500/10 px-2 py-1 pl-8 text-purple-200"
                animate={{
                  backgroundColor: [
                    "rgba(168,85,247,0.08)",
                    "rgba(168,85,247,0.2)",
                    "rgba(168,85,247,0.08)",
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
              >
                mid = (left + right) // 2
              </motion.p>

              <p className="text-white/35">05</p>

              <p className="pl-8 text-white/50">
                <span className="text-purple-300">if</span> arr[mid] == target:
              </p>

              <p className="text-white/35">06</p>

              <p className="pl-12 text-white/50">
                <span className="text-purple-300">return</span> mid
              </p>
            </div>
          </div>

          <div className="relative flex items-center justify-center overflow-hidden border-b border-white/10 p-8 md:border-b-0 md:border-r">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12),transparent_60%)]" />

            <motion.div
              className="absolute h-40 w-40 rounded-full border border-purple-400/10"
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <motion.div
              className="absolute h-64 w-64 rounded-full border border-purple-400/[0.04]"
              animate={{ rotate: -360 }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <div className="relative flex items-center gap-2">
              {[12, 24, 36, 48, 60, 72, 84].map((value, index) => (
                <motion.div
                  key={value}
                  className={`flex h-12 w-10 items-center justify-center rounded-lg border text-xs ${
                    index === 3
                      ? "border-purple-400/70 bg-purple-500/20 text-purple-200 shadow-lg shadow-purple-500/30"
                      : "border-white/10 bg-white/[0.03] text-white/35"
                  }`}
                  animate={
                    index === 3
                      ? {
                          y: [0, -5, 0],
                          boxShadow: [
                            "0 0 15px rgba(168,85,247,0.15)",
                            "0 0 30px rgba(168,85,247,0.45)",
                            "0 0 15px rgba(168,85,247,0.15)",
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {value}
                </motion.div>
              ))}
            </div>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-[10px] text-white/40 backdrop-blur-md">
              Step 04 / 08
            </div>
          </div>

          <div className="p-6">
            <div className="mb-5 flex items-center gap-2 text-xs text-white/40">
              <Sparkles size={14} className="text-purple-300" />
              AI tutor
            </div>

            <motion.div
              className="rounded-xl border border-purple-400/10 bg-purple-500/[0.06] p-4"
              animate={{
                borderColor: [
                  "rgba(168,85,247,0.1)",
                  "rgba(168,85,247,0.3)",
                  "rgba(168,85,247,0.1)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <p className="mb-3 text-xs leading-relaxed text-white/65">
                The middle element is selected because the target could still
                exist in the remaining search range.
              </p>

              <div className="flex items-center gap-2 text-[10px] text-purple-300/70">
                <Zap size={12} />
                Complexity: O(log n)
              </div>
            </motion.div>

            <div className="mt-5 flex items-center gap-2 text-[10px] text-white/25">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-purple-400"
                animate={{
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              Context synchronized with frame 04
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      <HeroScene />
      <FloatingIcons />

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/2 top-[-20%] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-purple-600/[0.08] blur-[140px]" />

        <div className="absolute bottom-[-15%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600/[0.06] blur-[140px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
      </div>

      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link to="/" className="group flex items-center gap-2.5">
          <motion.div
            whileHover={{ rotate: 8, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Logo size={27} />
          </motion.div>

          <span className="text-sm font-semibold tracking-[-0.02em]">
            Algo<span className="text-purple-300">Verse</span>
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <Link
            to="/login"
            className="text-sm text-white/50 transition hover:text-white"
          >
            Sign in
          </Link>

          <Link to="/register">
            <Button
              size="sm"
              className="rounded-full border border-white/10 bg-white px-5 text-black transition hover:bg-white/90"
            >
              Get started
              <ArrowUpRight size={14} className="ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-10 pt-24 text-center lg:pt-32">
        {floatingNodes.map((node) => (
          <FloatingNode key={node.label} {...node} />
        ))}

        <motion.div
          className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/[0.07] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-purple-300/90 backdrop-blur-md"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Sparkles size={12} />
          The visual layer for DSA
        </motion.div>

        <motion.h1
          className="mx-auto max-w-4xl text-5xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-8xl"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          Stop memorizing.
          <br />

          <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
            Start seeing.
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-8 max-w-xl text-[15px] leading-7 text-white/45 sm:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          AlgoVerse turns algorithms into living systems. Watch your code
          execute in 3D, understand every decision with AI, and build the
          intuition that actually lasts.
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <Link to="/register">
            <Button
              size="lg"
              className="group h-12 rounded-full bg-white px-7 text-sm font-medium text-black hover:bg-white/90"
            >
              Start learning free

              <ArrowUpRight
                size={16}
                className="ml-2 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Button>
          </Link>

          <Link
            to="/login"
            className="flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-white/70 backdrop-blur-md transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            <Play size={14} fill="currentColor" />
            Explore the platform
          </Link>
        </motion.div>

        <AlgorithmPreview />
      </section>

      <motion.section
        className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-28 lg:px-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-12 max-w-xl">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.25em] text-purple-300/70">
            Built differently
          </p>

          <h2 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
            Your mental model is the
            <span className="text-white/40"> real algorithm.</span>
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition duration-500 hover:border-purple-400/20 hover:bg-white/[0.045]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -6,
                }}
              >
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-purple-500/[0.06] blur-3xl transition group-hover:bg-purple-500/[0.12]" />

                <div className="relative">
                  <div className="mb-8 flex items-center justify-between">
                    <motion.div
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"
                      whileHover={{ rotate: 8, scale: 1.08 }}
                    >
                      <Icon size={18} className="text-purple-300" />
                    </motion.div>

                    <span className="text-[9px] font-medium tracking-[0.2em] text-white/25">
                      0{index + 1}
                    </span>
                  </div>

                  <p className="mb-3 text-[9px] font-medium tracking-[0.2em] text-purple-300/60">
                    {feature.label}
                  </p>

                  <h3 className="mb-3 text-xl font-medium tracking-[-0.025em]">
                    {feature.title}
                  </h3>

                  <p className="max-w-sm text-sm leading-6 text-white/40">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        className="relative z-10 mx-auto max-w-6xl px-6 pb-32 pt-20 lg:px-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-12">
          <div className="mb-14 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.25em] text-purple-300/70">
                The workflow
              </p>

              <h2 className="text-3xl font-medium tracking-[-0.04em]">
                Learn by following the logic.
              </h2>
            </div>

            <GitBranch size={28} className="text-white/20" />
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
              >
                {index < steps.length - 1 && (
                  <div className="absolute left-10 top-5 hidden h-px w-[calc(100%-2rem)] bg-gradient-to-r from-purple-400/30 to-transparent md:block" />
                )}

                <motion.div
                  className="relative mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-purple-400/20 bg-purple-500/10 text-xs font-medium text-purple-300"
                  whileHover={{
                    scale: 1.12,
                    boxShadow: "0 0 25px rgba(168,85,247,0.3)",
                  }}
                >
                  {step.step}
                </motion.div>

                <h3 className="mb-2 text-base font-medium">
                  {step.title}
                </h3>

                <p className="max-w-xs text-sm leading-6 text-white/40">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="relative z-10 overflow-hidden border-y border-white/10 px-6 py-28 text-center">
        <motion.div
          className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/[0.08] blur-[120px]"
          animate={{
            scale: [0.9, 1.1, 0.9],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10">
            <Target size={20} className="text-purple-300" />
          </div>

          <h2 className="mx-auto max-w-2xl text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
            Your next breakthrough
            <span className="text-white/40">
              {" "}
              starts with understanding.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-white/40">
            Build intuition. Strengthen your fundamentals. Become the developer
            who knows not just what works, but why.
          </p>

          <Link to="/register" className="mt-8 inline-block">
            <Button
              size="lg"
              className="group h-12 rounded-full bg-white px-7 text-black hover:bg-white/90"
            >
              Enter AlgoVerse

              <ArrowUpRight
                size={16}
                className="ml-2 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Button>
          </Link>
        </motion.div>
      </section>

      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 text-xs text-white/30 sm:flex-row lg:px-10">
        <Link to="/" className="flex items-center gap-2">
          <Logo size={17} />
          <span>AlgoVerse</span>
        </Link>

        <span>Built for learners who think in structure.</span>
      </footer>
    </main>
  );
}