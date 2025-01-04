import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

interface UserStore {
  name: string | null;
  email: string | null;
  isXConnected: boolean;
  isInstagramConnected: boolean;
  isLinkedinConnected: boolean;
  isYoutubeConnected: boolean;
  hydrated: boolean;

  setHydrated: () => void;
  setUser: (updates: Partial<UserStore>) => void;
}

export const defaultUser: Partial<UserStore> = {
  name: null,
  email: null,
  hydrated: false,
  isXConnected: false,
  isInstagramConnected: false,
  isLinkedinConnected: false,
  isYoutubeConnected: false
};

export const useUserStore = create<UserStore>()(
  persist(
    immer((set) => ({
      name: null,
      email: null,
      hydrated: false,
      isXConnected: false,
      isInstagramConnected: false,
      isLinkedinConnected: false,
      isYoutubeConnected: false,
      setHydrated: () => {
        set((state) => {
          state.hydrated = true;
        });
      },
      setUser: (updates: Partial<UserStore>) => {
        set((state) => {
          Object.entries(updates).forEach(([key, value]) => {
            (state as any)[key] = value ?? (state as any)[key];
          });
        });
      },
    })),
    {
      name: "user",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);
