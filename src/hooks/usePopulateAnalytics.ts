import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AllTabCardsData, ChartData } from "@/types/Charts";
import { useUserStore } from "@/store/user";
import { useAnalyticsStore } from "@/store/analytics";
import { getUserChartsAndCardsData } from "@/actions/chartActions";

export function usePopulateAnalytics() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [allChartsData, setAllChartsData] = useState<{
    xChartData: ChartData | null,
    linkedinChartData: ChartData | null,
    instagramChartData: ChartData | null,
    cardsData: AllTabCardsData | null
  }>({
    xChartData: null,
    linkedinChartData: null,
    instagramChartData: null,
    cardsData: null
  });
  const {
    isXConnected,
    isInstagramConnected,
    isLinkedinConnected,
    email,
  } = useUserStore();
  const { setAnalytics, chartsData, lastUpdateOfX, lastUpdateOfInstagram, lastUpdateOfLinkedin } = useAnalyticsStore();

  const populateAllAnalytics = async (userEmail: string | null) => {
    if (!userEmail) return;

    setLoading(true);
    let currentChartsData = chartsData;
    if (isXConnected || isInstagramConnected || isLinkedinConnected) {
      if (!currentChartsData) {
        const latestChartsData = await getUserChartsAndCardsData(userEmail);
    
        if (latestChartsData) {
          currentChartsData = latestChartsData;
        }
      }
    }
    if (setAnalytics) {
      setAnalytics({ chartsData: currentChartsData, isHydrated: true });
    }


    setAllChartsData({
      xChartData: currentChartsData ? currentChartsData.xData : null,
      linkedinChartData: currentChartsData ? currentChartsData.linkedinData : null,
      instagramChartData: currentChartsData ? currentChartsData.instagramData : null,
      cardsData: currentChartsData ? currentChartsData.cardsData : null
    });
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user && email === session.user.email) {
      populateAllAnalytics(email);
    }
  }, [lastUpdateOfX]);

  return { loading, allChartsData };
}
