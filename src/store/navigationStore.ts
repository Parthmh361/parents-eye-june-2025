import { create } from "zustand";

type NavigationState = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

export const useNavigationStore = create<NavigationState>((set) => ({
  activeSection: "School", // Default active section
  setActiveSection: (section) => set({ activeSection: section }),
}));
