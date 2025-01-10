import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { UserStore } from "@/types/Stores";

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
            (state as any)[key] = value;
          });
        });
      },
    })),
    {
      name: "user",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated(); // not working right now for some reason
          else console.error("Error occurred while hydrating user store: ", error);
        };
      },
    }
  )
);
