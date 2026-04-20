import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { api } from "@/lib/api";

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (p: { name: string; email: string; password: string; enrollmentNo: string }) => Promise<User>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      login: async (email, password) => {
        set({ loading: true });
        try {
          const user = await api.login(email, password);
          set({ user, loading: false });
          return user;
        } catch (e) {
          set({ loading: false });
          throw e;
        }
      },
      register: async (p) => {
        set({ loading: true });
        try {
          const user = await api.register(p);
          set({ user, loading: false });
          return user;
        } catch (e) {
          set({ loading: false });
          throw e;
        }
      },
      logout: () => set({ user: null }),
      updateUser: (patch) => set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
    }),
    { name: "srm-auth" }
  )
);
