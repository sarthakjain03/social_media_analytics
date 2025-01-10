import { TwitterChartData } from "./Charts";

export interface AnalyticsStore {
  lastUpdate: Date | null;
  isHydrated: boolean;
  xData: TwitterChartData | null;

  setIsHydrated: () => void;
  setAnalytics: (updatedData: Partial<AnalyticsStore>) => void;
}

export interface UserStore {
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
