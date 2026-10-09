import { create } from 'zustand';

export type User = {
  id: string;
  email: string;
  username: string;
  coins: number;
  gems: number;
  xp: number;
  level: number;
  streak: number;
};

type GameStore = {
  user: User | null;
  drawer: boolean;
  toast: string | null;
  setUser: (user: User | null) => void;
  setDrawer: (drawer: boolean) => void;
  notify: (message: string) => void;
  clearToast: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
  user: null,
  drawer: false,
  toast: null,
  setUser: (user) => set({ user }),
  setDrawer: (drawer) => set({ drawer }),
  notify: (message) => set({ toast: message }),
  clearToast: () => set({ toast: null }),
}));
