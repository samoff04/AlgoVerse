import { create } from "zustand";

export interface ChatMessage { role: "user" | "assistant"; content: string }

interface ChatState {
  messages: ChatMessage[]; open: boolean; loading: boolean;
  addMessage: (m: ChatMessage) => void; setLoading: (l: boolean) => void;
  toggleOpen: () => void; clear: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [{ role: "assistant", content: "Hey — ask me anything about the algorithm you're viewing." }],
  open: false, loading: false,
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  setLoading: (loading) => set({ loading }),
  toggleOpen: () => set((s) => ({ open: !s.open })),
  clear: () => set({ messages: [{ role: "assistant", content: "New conversation — what do you want to explore?" }] }),
}));