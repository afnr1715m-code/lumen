import { create } from "zustand";
import { persist } from "zustand/middleware";
import { users } from "@/data/roster";
import type { User } from "@/types/domain";

interface AuthState {
  currentUser: User | null;
  login: (userId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      login: (userId) => {
        const user = users.find((u) => u.id === userId) ?? null;
        set({ currentUser: user });
      },
      logout: () => set({ currentUser: null }),
    }),
    { name: "company-ops-auth" }
  )
);
