import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Boxes, GitBranch, Network } from "lucide-react";

import { loginUser, loginWithGoogle } from "../lib/auth";
import { useAuthStore } from "../stores/authStore";
import { FloatingIcons } from "../components/landing/FloatingIcons";
import { Logo } from "../components/brand/Logo";
import { Button } from "@/components/ui/button";

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

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const user = await loginUser(email, password);

      setUser(user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.error ?? "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#070709] text-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left product panel */}
        <section className="relative hidden overflow-hidden border-r border-white/10 bg-white/[0.02] lg:flex lg:flex-col lg:justify-between lg:p-10">
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:64px_64px]" />

          <div className="pointer-events-none absolute left-1/4 top-1/3 h-80 w-80 rounded-full bg-purple-600/10 blur-[120px]" />

          <FloatingIcons />

          <Link
            to="/"
            className="relative z-10 flex w-fit items-center gap-2 text-sm font-medium"
          >
            <Logo size={22} />
            <span>AlgoVerse</span>
          </Link>

          <div className="relative z-10 max-w-lg">
            <div className="mb-5 inline-flex items-center rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-purple-300">
              AI-powered learning
            </div>

            <h2 className="text-5xl font-medium leading-[1.05] tracking-[-0.05em]">
              Pick up right where
              <span className="block text-purple-300">
                you left off.
              </span>
            </h2>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/40">
              Your algorithms, progress, streaks, and learning journey
              are waiting for you.
            </p>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-purple-400/20 hover:bg-white/[0.05]">
                <Boxes
                  size={18}
                  className="mb-4 text-purple-300"
                />

                <p className="text-xs font-medium">Visualize</p>

                <p className="mt-1 text-[10px] leading-4 text-white/35">
                  See structures clearly
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-blue-400/20 hover:bg-white/[0.05]">
                <Network
                  size={18}
                  className="mb-4 text-blue-300"
                />

                <p className="text-xs font-medium">Understand</p>

                <p className="mt-1 text-[10px] leading-4 text-white/35">
                  Follow every step
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-emerald-400/20 hover:bg-white/[0.05]">
                <GitBranch
                  size={18}
                  className="mb-4 text-emerald-300"
                />

                <p className="text-xs font-medium">Master</p>

                <p className="mt-1 text-[10px] leading-4 text-white/35">
                  Build intuition
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-white/20">
            <span>Built for structured thinkers</span>

            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Systems online
            </span>
          </div>
        </section>

        {/* Authentication panel */}
        <section className="flex min-h-screen items-center justify-center px-6 py-16 sm:px-10">
          <div className="w-full max-w-sm">
            <Link
              to="/"
              className="mb-10 flex items-center gap-2 text-sm text-white/40 transition hover:text-white lg:hidden"
            >
              <Logo size={19} />
              <span>AlgoVerse</span>
            </Link>

            <div className="mb-7">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10">
                <Logo size={23} />
              </div>

              <h1 className="text-3xl font-medium tracking-tight">
                Welcome back.
              </h1>

              <p className="mt-2 text-sm text-white/40">
                Continue your learning journey.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20">
              <button
                type="button"
                onClick={loginWithGoogle}
                className="group flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white text-sm font-medium text-black transition hover:bg-white/90"
              >
                <GoogleIcon />

                <span>Continue with Google</span>
              </button>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />

                <span className="text-xs text-white/30">
                  or
                </span>

                <div className="h-px flex-1 bg-white/10" />
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs text-white/50"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                    autoComplete="email"
                    className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm outline-none transition placeholder:text-white/20 focus:border-purple-400/50 focus:ring-4 focus:ring-purple-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs text-white/50"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                    autoComplete="current-password"
                    className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm outline-none transition placeholder:text-white/20 focus:border-purple-400/50 focus:ring-4 focus:ring-purple-500/10"
                  />
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2.5 text-xs leading-5 text-red-300"
                  >
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-xl"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </div>

            <p className="mt-6 text-center text-xs text-white/40">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-purple-300 transition hover:text-purple-200 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}