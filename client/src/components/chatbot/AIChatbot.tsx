import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../../stores/chatStore";
import { Sparkles, X, Send, Trash2 } from "lucide-react";
import { usePlaybackStore } from "../../stores/playbackStore";
import { api } from "../../lib/api";

export function AIChatbot() {
  const { messages, open, loading, addMessage, setLoading, toggleOpen, clear } = useChatStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const step = usePlaybackStore((s) => s.step);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, loading]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user" as const, content: input };
    addMessage(userMsg);
    setInput("");
    setLoading(true);
    try {
      const { data } = await api.post("/tutor", { messages: [...messages, userMsg], stepContext: { step } });
      addMessage({ role: "assistant", content: data.answer });
    } catch (err: any) {
      addMessage({ role: "assistant", content: `Tutor error: ${err.response?.data?.error ?? err.message}` });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={toggleOpen} className="fixed bottom-6 right-6 z-50 flex h-13 w-13 items-center justify-center rounded-full border border-purple-400/30 bg-[#0c0c10] p-3.5 text-purple-300 shadow-lg shadow-purple-500/10 hover:border-purple-400/60">
        {open ? <X size={20} /> : <Sparkles size={20} className="animate-pulse" />}
      </button>
      <div className={`fixed bottom-24 right-6 z-50 flex w-[360px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c] transition-all duration-200 ${open ? "h-[480px] opacity-100" : "pointer-events-none h-0 opacity-0"}`}>
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <span className="text-sm font-medium">AI Tutor</span>
          <button onClick={clear} className="text-white/30 hover:text-white/60"><Trash2 size={14} /></button>
        </div>
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-xl px-3 py-2 text-[13px] leading-relaxed ${m.role === "user" ? "bg-purple-500/20 text-purple-100" : "bg-white/5 text-white/80"}`}>{m.content}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-white/10 p-3">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask about this algorithm..." className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[13px] outline-none focus:border-purple-400/40" />
          <button onClick={send} disabled={loading} className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300 disabled:opacity-40"><Send size={14} /></button>
        </div>
      </div>
    </>
  );
}