import { create } from "zustand";

interface User { id: string; name: string; email: string; xp: number; streak: number; avatarUrl?: string }

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
  setLoading: (l: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
}));