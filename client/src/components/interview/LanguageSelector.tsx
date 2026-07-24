import { useState, useRef, useEffect } from "react";
import { languages } from "../../interview/languages";
import { ChevronDown, Check } from "lucide-react";

export function LanguageSelector({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = languages.find((l) => l.id === value) ?? languages[0];

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
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm transition hover:border-white/20"
      >
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: current.color }} />
        {current.label}
        <ChevronDown size={13} className={`text-white/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`absolute left-0 top-10 z-20 w-48 origin-top rounded-xl border border-white/10 bg-[#0a0a0d] p-1.5 shadow-2xl transition-all duration-150 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {languages.map((l) => (
          <button
            key={l.id}
            onClick={() => {
              onChange(l.id);
              setOpen(false);
            }}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />
              {l.label}
              {!l.executable && <span className="text-[10px] text-white/30">(AI review only)</span>}
            </span>
            {l.id === value && <Check size={13} className="text-purple-300" />}
          </button>
        ))}
      </div>
    </div>
  );
}