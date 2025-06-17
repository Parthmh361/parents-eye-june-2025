import { create } from "zustand";

type AuthStore = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

export const useAuth = create<AuthStore>((set) => ({
  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
}));
