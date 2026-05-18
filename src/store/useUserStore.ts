import { create } from "zustand";
import { AppUser } from "../services/auth";

interface UserStore {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  updateXP: (xp: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateXP: (xpToAdd) =>
    set((state) => {
      if (!state.user) return state;
      const newXP = state.user.xp + xpToAdd;
      return { user: { ...state.user, xp: newXP } };
    }),
}));
