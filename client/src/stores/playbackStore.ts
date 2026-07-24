import { create } from "zustand";

interface PlaybackState {
  step: number;
  totalSteps: number;
  playing: boolean;
  speed: number;

  setStep: (step: number) => void;
  setTotalSteps: (totalSteps: number) => void;
  togglePlay: () => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
}

export const usePlaybackStore =
  create<PlaybackState>((set) => ({
    step: 0,
    totalSteps: 0,
    playing: false,
    speed: 1,

    setStep: (step) =>
      set({
        step,
      }),

    setTotalSteps: (totalSteps) =>
      set({
        totalSteps,
        step: 0,
      }),

    togglePlay: () =>
      set((state) => ({
        playing: !state.playing,
      })),

    setSpeed: (speed) =>
      set({
        speed,
      }),

    reset: () =>
      set({
        step: 0,
        totalSteps: 0,
        playing: false,
      }),
  }));