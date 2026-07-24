import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, loginWithGoogle } from "../lib/auth";
import { useAuthStore } from "../stores/authStore";
import { Button } from "@/components/ui/button";
import { Logo } from "../components/brand/Logo";
import { FloatingIcons } from "../components/landing/FloatingIcons";
import {
  ArrowRight,
  Boxes,
  Check,
  Code2,
  GitBranch,
  Network,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";

function GoogleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.5H24v7.9h11.3c-1 5.2-5.5 8.9-11.3 8.9-6.9 0-12.5-5.6-12.5-12.5S17.1 12.3 24 12.3c3.1 0 5.9 1.1 8.1 3l5.9-5.9C34.7 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11.5 0 19.1-8.1 19.1-19.5 0-1.3-.1-2.3-.3-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.5 4.8C14.6 15.9 18.9 12.3 24 12.3c3.1 0 5.9 1.1 8.1 3l5.9-5.9C34.7 6 29.6 4 24 4c-7.5 0-14 4.2-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.5-1.9 14.3-5.1l-6.6-5.4c-2 1.5-4.7 2.5-7.7 2.5-5.8 0-10.6-3.7-12.4-8.8l-6.6 5.1C8.1 39.7 15.4 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H24v7.9h11.3c-.9 4.7-4.9 8.4-11.3 8.9v7c11.5-1 19.1-8.1 19.1-19.5 0-1.3-.1-2.3-.3-3.5z"
      />
    </svg>
  );
}

function getPasswordStrength(password: string) {
  if (!password) {
    return {
      score: 0,
      label: "Use at least 6 characters",
    };
  }

  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) {
    return {
      score,
      label: "Weak password",
    };
  }

  if (score <= 3) {
    return {
      score,
      label: "Good password",
    };
  }

  return {
    score,
    label: "Strong password",
  };
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password]
  );

  const completedFields = [name, email, password].filter(
    (value) => value.trim().length > 0
  ).length;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const user = await registerUser(name, email, password);

      setUser(user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.error ??
          "Could not create your account"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070709] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-purple-600/[0.08] blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/[0.05] blur-[150px]" />

      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT PRODUCT EXPERIENCE */}
        <section className="relative hidden overflow-hidden border-r border-white/[0.08] lg:flex lg:flex-col lg:justify-between lg:p-10">
          <FloatingIcons />

          <div className="relative z-10 flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-medium tracking-tight"
            >
              <Logo size={22} />
              AlgoVerse
            </Link>

            <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/40">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
              Learning OS
            </div>
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/[0.08] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-purple-300">
              <Sparkles size={12} />
              Built for deep understanding
            </div>

            <h2 className="max-w-lg text-5xl font-medium leading-[1.02] tracking-[-0.06em]">
              Don't just learn algorithms.
              <span className="mt-2 block text-white/35">
                See them think.
              </span>
            </h2>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/45">
              Build intuition through interactive visualizations, AI-guided
              explanations, complexity analysis, and real interview practice.
            </p>

            {/* Product preview */}
            <div className="relative mt-12 max-w-lg">
              <div className="absolute -inset-8 rounded-[40px] bg-purple-500/[0.07] blur-3xl" />

              <div className="relative overflow-hidden rounded-3xl border border-white/[0.10] bg-[#0b0b0f]/90 shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10">
                      <Code2 size={13} className="text-purple-300" />
                    </div>

                    <span className="text-xs text-white/60">
                      algorithm.visualizer
                    </span>
                  </div>

                  <span className="flex items-center gap-1.5 text-[10px] text-emerald-300/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Live
                  </span>
                </div>

                <div className="grid grid-cols-[1fr_130px] gap-4 p-4">
                  <div className="relative flex h-36 items-end justify-center gap-1.5 rounded-2xl border border-white/[0.06] bg-black/20 px-5 pb-5">
                    {[38, 62, 48, 82, 56, 94, 70, 44, 76].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="w-3 rounded-t-sm bg-purple-400/50"
                          style={{
                            height: `${height}%`,
                            animation: `pulse ${
                              1.5 + index * 0.12
                            }s ease-in-out infinite`,
                          }}
                        />
                      )
                    )}

                    <div className="absolute left-4 top-4 flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-white/25">
                      <ActivityIcon />
                      visual state
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                      <p className="text-[9px] uppercase tracking-widest text-white/25">
                        Complexity
                      </p>

                      <p className="mt-1 text-lg font-medium text-purple-300">
                        O(n²)
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                      <p className="text-[9px] uppercase tracking-widest text-white/25">
                        AI insight
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-white/45">
                        Comparing adjacent values
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4 text-white/20">
              <Boxes size={18} />
              <Network size={18} />
              <GitBranch size={18} />
              <Terminal size={18} />
            </div>

            <p className="text-[10px] uppercase tracking-[0.18em] text-white/20">
              Learn · Build · Master
            </p>
          </div>
        </section>

        {/* RIGHT AUTH EXPERIENCE */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-[430px]">
            {/* Mobile logo */}
            <Link
              to="/"
              className="mb-10 flex items-center gap-2 text-sm font-medium lg:hidden"
            >
              <Logo size={20} />
              AlgoVerse
            </Link>

            {/* Header */}
            <div className="mb-8">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-purple-300/70">
                    Start your journey
                  </p>

                  <h1 className="text-3xl font-medium tracking-[-0.04em]">
                    Create your account
                  </h1>

                  <p className="mt-2 text-sm text-white/40">
                    Your algorithmic thinking starts here.
                  </p>
                </div>

                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/[0.08] sm:flex">
                  <Zap size={18} className="text-purple-300" />
                </div>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`h-1 flex-1 rounded-full transition ${
                      completedFields >= step
                        ? "bg-purple-400"
                        : "bg-white/[0.08]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Auth card */}
            <div className="rounded-3xl border border-white/[0.10] bg-white/[0.025] p-5 shadow-2xl shadow-black/20 sm:p-6">
              <button
                type="button"
                onClick={loginWithGoogle}
                className="group flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-white/[0.12] bg-white text-sm font-medium text-black transition hover:bg-white/90"
              >
                <GoogleIcon />

                Continue with Google

                <ArrowRight
                  size={14}
                  className="ml-1 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-60"
                />
              </button>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/[0.08]" />

                <span className="text-[10px] uppercase tracking-[0.18em] text-white/25">
                  or continue with email
                </span>

                <div className="h-px flex-1 bg-white/[0.08]" />
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="mb-2 block text-xs font-medium text-white/55">
                    Full name
                  </label>

                  <input
                    type="text"
                    placeholder="Ada Lovelace"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    className="h-11 w-full rounded-xl border border-white/[0.10] bg-black/20 px-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-purple-400/50 focus:bg-purple-500/[0.04] focus:ring-4 focus:ring-purple-500/[0.06]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-white/55">
                    Email address
                  </label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-11 w-full rounded-xl border border-white/[0.10] bg-black/20 px-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-purple-400/50 focus:bg-purple-500/[0.04] focus:ring-4 focus:ring-purple-500/[0.06]"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-medium text-white/55">
                      Password
                    </label>

                    <span className="text-[10px] text-white/25">
                      6+ characters
                    </span>
                  </div>

                  <input
                    type="password"
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="h-11 w-full rounded-xl border border-white/[0.10] bg-black/20 px-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-purple-400/50 focus:bg-purple-500/[0.04] focus:ring-4 focus:ring-purple-500/[0.06]"
                  />

                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex flex-1 gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition ${
                            passwordStrength.score >= level
                              ? "bg-purple-400"
                              : "bg-white/[0.08]"
                          }`}
                        />
                      ))}
                    </div>

                    <span className="text-[10px] text-white/30">
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-400/20 bg-red-500/[0.06] px-3 py-2.5 text-xs leading-5 text-red-300">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="group h-11 w-full gap-2 rounded-xl"
                >
                  {loading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating your account...
                    </>
                  ) : (
                    <>
                      Create account

                      <ArrowRight
                        size={15}
                        className="transition group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-5 flex items-start gap-2 text-[10px] leading-5 text-white/25">
                <Check
                  size={13}
                  className="mt-0.5 shrink-0 text-purple-300/70"
                />

                <span>
                  By creating an account, you can save progress, track mastery,
                  join contests, and unlock the full AlgoVerse experience.
                </span>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-white/35">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-purple-300 transition hover:text-purple-200 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function ActivityIcon() {
  return (
    <span className="flex items-center gap-0.5">
      <span className="h-1 w-1 rounded-full bg-purple-400" />
      <span className="h-1.5 w-1 rounded-full bg-purple-400/70" />
      <span className="h-2 w-1 rounded-full bg-purple-400/50" />
    </span>
  );
}