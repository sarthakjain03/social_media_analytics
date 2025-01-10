import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { TwitterChartData } from "@/types/Charts";

interface Analytics {
  lastUpdate: Date | null;
  isHydrated: boolean;
  xData: TwitterChartData | null;

  setIsHydrated: () => void;
  setAnalytics: (updatedData: Partial<Analytics>) => void;
}

export const defaultAnalytics: Partial<Analytics> = {
  lastUpdate: null,
  isHydrated: false,
  xData: null,
};

export const useAnalyticsStore = create<Analytics>()(
  persist(
    immer((set) => ({
      lastUpdate: null,
      isHydrated: false,
      xData: null,
      setIsHydrated: () => {
        set((state) => {
          state.isHydrated = true;
        });
      },
      setAnalytics: (updatedData: Partial<Analytics>) => {
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
