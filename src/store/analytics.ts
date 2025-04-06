import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { AnalyticsStore } from "@/types/Stores";

export const defaultAnalytics: Partial<AnalyticsStore> = {
  lastUpdateOfX: null,
  lastUpdateOfInstagram: null,
  lastUpdateOfGithub: null,
  isHydrated: false,
  chartsData: {
    twitterData: null,
    githubData: null,
    instagramData: null,
    cardsData: null
  }
};

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    immer((set) => ({
      lastUpdateOfX: null,
      lastUpdateOfInstagram: null,
      lastUpdateOfGithub: null,
      isHydrated: false,
      chartsData: {
        twitterData: null,
        githubData: null,
        instagramData: null,
        cardsData: null
      },
      setIsHydrated: () => {
        set((state) => {
          state.isHydrated = true;
        });
      },
      setAnalytics: (updatedData: Partial<AnalyticsStore>) => {
        set((state) => {
          Object.entries(updatedData).forEach(([key, value]) => {
            (state as any)[key] = value;
          });
        });
      },
    })),
    {
      name: "analytics",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setIsHydrated(); // not working right now for some reason
          else console.error("Error occurred while hydrating analytics store: ", error);
        };
      },
    }
  )
);
