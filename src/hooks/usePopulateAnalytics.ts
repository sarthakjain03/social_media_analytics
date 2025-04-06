import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AllTabCardsData, ChartData, GithubChartData } from "@/types/Charts";
import { useUserStore } from "@/store/user";
import { useAnalyticsStore } from "@/store/analytics";
import { getUserChartsAndCardsData } from "@/actions/chartActions";

export function usePopulateAnalytics() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [allChartsData, setAllChartsData] = useState<{
    xChartData: ChartData | null,
    githubChartData: GithubChartData | null,
    instagramChartData: ChartData | null,
    cardsData: AllTabCardsData | null
  }>({
    xChartData: null,
    githubChartData: null,
    instagramChartData: null,
    cardsData: null,
  });
    useUserStore();
  const {
    isXConnected,
    isInstagramConnected,
    isGithubConnected,
    email,
  } = useUserStore();
  const { setAnalytics, chartsData, lastUpdateOfX, lastUpdateOfInstagram, lastUpdateOfGithub } = useAnalyticsStore();

  const populateAllAnalytics = async (userEmail: string) => {
    setLoading(true);
    let currentChartsData = chartsData;
    let lastXUpdate: Date | null = null;
    let lastInstagramUpdate: Date | null = null;
    let lastGithubUpdate: Date | null = null;

    if (isXConnected || isInstagramConnected || isGithubConnected) {
      const { instagramData, twitterData, githubData } = chartsData;

      if (!twitterData && !instagramData && !githubData) {
        const latestChartsData = await getUserChartsAndCardsData(userEmail);

        if (latestChartsData?.lastUpdateOfX) {
          lastXUpdate = latestChartsData.lastUpdateOfX;
        }

        if (latestChartsData?.lastUpdateOfInstagram) {
          lastInstagramUpdate = latestChartsData.lastUpdateOfInstagram;
        }

        if (latestChartsData?.lastUpdateOfGithub) {
          lastGithubUpdate = latestChartsData.lastUpdateOfGithu;
        }

        if (latestChartsData?.chartsData) {
          currentChartsData = latestChartsData.chartsData;
        }
      }
    }

    if (setAnalytics) {
      setAnalytics({
        chartsData: currentChartsData,
        lastUpdateOfX: lastXUpdate,
        lastUpdateOfInstagram: lastInstagramUpdate,
        isHydrated: true,
      });
    }

    setAllChartsData({
      xChartData: currentChartsData ? currentChartsData.twitterData : null,
      githubChartData: currentChartsData ? currentChartsData.githubData : null,
      instagramChartData: currentChartsData ? currentChartsData.instagramData : null,
      cardsData: currentChartsData ? currentChartsData.cardsData : null
    });
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user && email === session.user.email) {
      populateAllAnalytics(session.user.email as string);
    } else {
      setLoading(false);
    }
  }, [lastUpdateOfX, session, email, lastUpdateOfInstagram]);
  // }, [lastUpdateOfX, session, email, lastUpdateOfInstagram, lastUpdateOfLinkedin]);

  return { loading, allChartsData };
}
