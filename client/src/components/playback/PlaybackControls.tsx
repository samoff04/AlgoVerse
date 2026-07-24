import { usePlaybackStore } from "../../stores/playbackStore";
import { Play, Pause, SkipBack, SkipForward, Gauge } from "lucide-react";
import { useEffect } from "react";

export function PlaybackControls() {
  const { step, totalSteps, playing, speed, setStep, togglePlay, setSpeed } = usePlaybackStore();

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      const s = usePlaybackStore.getState();
      if (s.step >= s.totalSteps) { s.togglePlay(); return; }
      s.setStep(s.step + 1);
    }, 400 / speed);
    return () => clearInterval(interval);
  }, [playing, speed]);

  return (
    <div className="flex items-center gap-4 px-5 py-3.5">
      <div className="flex items-center gap-2">
        <button onClick={() => setStep(Math.max(0, step - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/70 hover:border-white/25 hover:text-white"><SkipBack size={14} /></button>
        <button onClick={togglePlay} className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500 text-white hover:bg-purple-400">{playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}</button>
        <button onClick={() => setStep(Math.min(totalSteps, step + 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/70 hover:border-white/25 hover:text-white"><SkipForward size={14} /></button>
      </div>
      <input type="range" min={0} max={totalSteps} step={1} value={step} onChange={(e) => setStep(Number(e.target.value))} className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-purple-500" />
      <span className="w-16 shrink-0 text-right text-xs tabular-nums text-white/40">{step}/{totalSteps}</span>
      <div className="flex items-center gap-1 border-l border-white/10 pl-3">
        <Gauge size={13} className="text-white/30" />
        {[0.5, 1, 1.5, 2].map((s) => (
          <button key={s} onClick={() => setSpeed(s)} className={`rounded-md px-1.5 py-1 text-[11px] ${speed === s ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"}`}>{s}x</button>
        ))}
      </div>
    </div>
  );
}