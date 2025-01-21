import { AllTabCardsData, ChartData } from "./Charts";

export interface AnalyticsStore {
  lastUpdateOfX: Date | null;
  lastUpdateOfLinkedin: Date | null;
  lastUpdateOfInstagram: Date | null;
  isHydrated: boolean;
  chartsData: {
    xData: ChartData | null;
    linkedinData: ChartData | null;
    instagramData: ChartData | null;
    cardsData: AllTabCardsData | null;
  };

  setIsHydrated: () => void;
  setAnalytics: (updatedData: Partial<AnalyticsStore>) => void;
}

export interface UserStore {
  name: string | null;
  email: string | null;
  isXConnected: boolean;
  isInstagramConnected: boolean;
  isLinkedinConnected: boolean;
  hydrated: boolean;

  setHydrated: () => void;
  setUser: (updates: Partial<UserStore>) => void;
}
