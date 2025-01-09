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
  lastUpdateOfX: Date | null;
  lastUpdateOfInstagram: Date | null;
  lastUpdateOfLinkedin: Date | null;
  lastUpdateOfYoutube: Date | null;
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
  isYoutubeConnected: false,
  lastUpdateOfX: null,
  lastUpdateOfInstagram: null,
  lastUpdateOfLinkedin: null,
  lastUpdateOfYoutube: null
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
      lastUpdateOfX: null,
      lastUpdateOfInstagram: null,
      lastUpdateOfLinkedin: null,
      lastUpdateOfYoutube: null,
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
          if (!error) state?.setHydrated();
          else console.error("Error occurred while hydrating user state: ", error);
        };
      },
    }
  )
);
