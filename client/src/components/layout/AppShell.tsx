import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { UserMenu } from "./UserMenu";
import { algorithmRegistry } from "../../algorithms/registry";
import { Logo } from "../brand/Logo";
import { ChevronDown, Binary } from "lucide-react";

const structureLinks = [
  { to: "/structures/linked-list", label: "Linked list" },
  { to: "/structures/stack", label: "Stack" },
  { to: "/structures/tree", label: "Binary search tree" },
];

function AlgorithmsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition ${
          open ? "bg-white/5 text-white" : "text-white/50 hover:text-white"
        }`}
      >
        Algorithms
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`absolute left-0 top-11 w-64 origin-top rounded-xl border border-white/10 bg-[#0a0a0d] p-1.5 shadow-2xl transition-all duration-150 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-white/30">Sorting</p>
        {algorithmRegistry.map((a) => (
          <Link
            key={a.slug}
            to={`/learn/${a.slug}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-purple-500/10 hover:text-white"
          >
            <Binary size={14} className="text-purple-300/70" />
            {a.title}
          </Link>
        ))}

        <div className="my-1 h-px bg-white/10" />

        <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-white/30">Data structures</p>
        {structureLinks.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-purple-500/10 hover:text-white"
          >
            <Binary size={14} className="text-purple-300/70" />
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

const links = [
  { to: "/visualize", label: "Visualize" },
  { to: "/interview", label: "Interview" },
  { to: "/contest", label: "Contests" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/playground", label: "Playground" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#030303]/80 px-6 py-3.5 backdrop-blur-md">
        <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium tracking-tight">
          <Logo size={22} />
          AlgoVerse
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          <AlgorithmsDropdown />
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                location.pathname.startsWith(l.to) ? "bg-white/5 text-white" : "text-white/50 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <UserMenu />
      </nav>
      {children}
    </div>
  );
}