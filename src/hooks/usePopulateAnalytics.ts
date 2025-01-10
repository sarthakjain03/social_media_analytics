import { AnalyticsStore, UserStore } from "@/types/Stores";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getXUserData } from "@/actions/twitterActions";
import { TwitterChartData } from "@/types/Charts";
import { useUserStore } from "@/store/user";
import { useAnalyticsStore } from "@/store/analytics";

export function usePopulateAnalytics() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [xChartData, setXChartData] = useState<TwitterChartData | null>(null);
  const {
    isXConnected,
    isInstagramConnected,
    isLinkedinConnected,
    isYoutubeConnected,
    email,
  } = useUserStore();
  const { setAnalytics, xData, lastUpdateOfX } = useAnalyticsStore();

  const populateXData = async () => {
    setLoading(true);
    let currentXData: TwitterChartData | null = xData ? xData : null;
    if (isXConnected) {
      const xDataFromDB = await getXUserData(email as string);
      if (xDataFromDB?.chartsData) {
        currentXData = xDataFromDB.chartsData;
      }
    }
    
    setXChartData(currentXData);
    if (setAnalytics) {
      setAnalytics({ xData: currentXData });
    }
    setLoading(false);
  }

  const populateAllAnalytics = async () => {
    setLoading(true);
    await populateXData();
    setLoading(false);
  };

  // useEffect(() => {
  //   if (session?.user && email === session.user.email) {
  //     populateAllAnalytics();
  //   }
  // }, [session, email]);

  useEffect(() => {
    if (session?.user && email === session.user.email && lastUpdateOfX) {
      populateXData();
    }
  }, [lastUpdateOfX]);

  return { loading, xChartData };
}
