import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AllTabCardsData, ChartData } from "@/types/Charts";
import { useUserStore } from "@/store/user";
import { useAnalyticsStore } from "@/store/analytics";
import { getUserChartsAndCardsData } from "@/actions/chartActions";

export function usePopulateAnalytics() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [allChartsData, setAllChartsData] = useState<{
    xChartData: ChartData | null;
    linkedinChartData: ChartData | null;
    instagramChartData: ChartData | null;
    cardsData: AllTabCardsData | null;
  }>({
    xChartData: null,
    linkedinChartData: null,
    instagramChartData: null,
    cardsData: null,
  });
  const { isXConnected, isInstagramConnected, isLinkedinConnected, email } =
    useUserStore();
  const {
    setAnalytics,
    chartsData,
    lastUpdateOfX,
    lastUpdateOfInstagram,
    lastUpdateOfLinkedin,
  } = useAnalyticsStore();

  const populateAllAnalytics = async (userEmail: string) => {
    setLoading(true);
    let currentChartsData = chartsData;
    let lastXUpdate: Date | null = null;
    let lastInstagramUpdate: Date | null = null;
    // let lastLinkedInUpdate: Date | null = null;

    if (isXConnected || isInstagramConnected || isLinkedinConnected) {
      const { instagramData, twitterData, linkedinData } = chartsData;

      if (!twitterData && !instagramData && !linkedinData) {
        const latestChartsData = await getUserChartsAndCardsData(userEmail);

        if (latestChartsData?.lastUpdateOfX) {
          lastXUpdate = latestChartsData.lastUpdateOfX;
        }

        if (latestChartsData?.lastUpdateOfInstagram) {
          lastInstagramUpdate = latestChartsData.lastUpdateOfInstagram;
        }

        // if (latestChartsData?.lastUpdateOfLinkedin) {
        //   lastLinkedInUpdate = latestChartsData.lastUpdateOfLinkedin;
        // }

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
      linkedinChartData: currentChartsData
        ? currentChartsData.linkedinData
        : null,
      instagramChartData: currentChartsData
        ? currentChartsData.instagramData
        : null,
      cardsData: currentChartsData ? currentChartsData.cardsData : null,
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
