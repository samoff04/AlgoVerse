import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Loader2, ShieldCheck } from "lucide-react";
import { fetchMe } from "../lib/auth";
import { useAuthStore } from "../stores/authStore";

export default function AuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    localStorage.setItem("token", token);

    fetchMe()
      .then((user) => {
        setUser(user);
        navigate("/dashboard", { replace: true });
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      });
  }, [navigate, params, setUser]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07070a] text-white">
      {/* Ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/[0.08] blur-[140px]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,7,10,0.65)_75%)]" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* Logo mark */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/[0.08]"
        >
          <div className="absolute inset-0 rounded-2xl bg-purple-500/10 blur-xl" />

          <ShieldCheck
            size={26}
            strokeWidth={1.5}
            className="relative text-purple-300"
          />
        </motion.div>

        <h1 className="mb-2 text-lg font-medium tracking-tight">
          Authenticating your session
        </h1>

        <p className="mb-7 text-sm text-white/35">
          Preparing your AlgoVerse workspace
        </p>

        {/* Loading indicator */}
        <div className="flex items-center gap-2 text-xs text-white/35">
          <Loader2
            size={14}
            className="animate-spin text-purple-300"
          />

          <span>Verifying credentials</span>
        </div>

        {/* Progress indicator */}
        <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-purple-400 to-transparent"
          />
        </div>
      </motion.div>

      {/* Bottom status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/20"
      >
        <Check size={11} className="text-emerald-400/70" />
        Secure authentication
      </motion.div>
    </main>
  );
}