import { AllTabCardsData, ChartData, GithubChartData } from "./Charts";

export interface AnalyticsStore {
  lastUpdateOfX: Date | null;
  lastUpdateOfGithub: Date | null;
  lastUpdateOfInstagram: Date | null;
  isHydrated: boolean;
  chartsData: {
    twitterData: ChartData | null;
    githubData: GithubChartData | null;
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
  isGithubConnected: boolean;
  hydrated: boolean;

  setHydrated: () => void;
  setUser: (updates: Partial<UserStore>) => void;
}
