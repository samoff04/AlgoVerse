import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { logout } from "../../lib/auth";
import { LogOut, LayoutDashboard, Flame, Zap } from "lucide-react";

export function UserMenu() {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (!user) {
    return (
      <Link to="/login" className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/70 transition hover:border-white/30 hover:text-white">
        Sign in
      </Link>
    );
  }

  const initials = user.name.charAt(0).toUpperCase();
  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-400/30 bg-gradient-to-br from-purple-500/30 to-purple-500/10 text-xs font-medium text-purple-200 transition hover:border-purple-400/60"
      >
        {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" /> : initials}
      </button>

      <div
        className={`absolute right-0 top-11 w-64 origin-top-right rounded-xl border border-white/10 bg-[#0a0a0d] p-1.5 shadow-2xl transition-all duration-150 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/30 to-purple-500/10 text-sm font-medium text-purple-200">
            {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" /> : initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-white/40">{user.email}</p>
          </div>
        </div>

        <div className="mx-3 mb-2 flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2 text-xs">
          <span className="flex items-center gap-1 text-white/60"><Flame size={12} className="text-orange-400" /> {user.streak} day streak</span>
          <span className="flex items-center gap-1 text-white/60"><Zap size={12} className="text-yellow-400" /> {user.xp} XP</span>
        </div>

        <div className="my-1 h-px bg-white/10" />
        <Link to="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white">
          <LayoutDashboard size={15} /> Dashboard
        </Link>
        <div className="my-1 h-px bg-white/10" />
        <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-400/90 transition hover:bg-red-500/10">
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </div>
  );
}