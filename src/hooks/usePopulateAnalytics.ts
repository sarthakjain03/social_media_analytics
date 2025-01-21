import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getXUserData } from "@/actions/twitterActions";
import { ChartData } from "@/types/Charts";
import { useUserStore } from "@/store/user";
import { useAnalyticsStore } from "@/store/analytics";

export function usePopulateAnalytics() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [xChartData, setXChartData] = useState<ChartData | null>(null);
  const [allChartsData, setAllChartsData] = useState<{
    xChartData: ChartData | null,
    // linkedin and instagram to be added
  }>({
    xChartData: null,
    //linkedinChartData: null,
    //instagramChartData: null
  });
  const {
    isXConnected,
    isInstagramConnected,
    isLinkedinConnected,
    email,
  } = useUserStore();
  const { setAnalytics, xData, lastUpdateOfX } = useAnalyticsStore();

  const populateXData = async () : Promise<ChartData | null> => {
    let currentXData: ChartData | null = xData ? xData : null;
    if (isXConnected) {
      //setLoading(true);
      if (currentXData === null) {
        const xDataFromDB = await getXUserData(email as string);
        if (xDataFromDB?.chartsData) {
          currentXData = xDataFromDB.chartsData;
        }
        
      }
      //setXChartData(currentXData);
      //setLoading(false);
    }
    return currentXData;
  }

  const populateAllAnalytics = async () => {
    setLoading(true);
    const updatedXChartData = await populateXData();

    if (setAnalytics) {
      setAnalytics({ xData: updatedXChartData, isHydrated: true });
    }

    setAllChartsData({
      xChartData: updatedXChartData
    });
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user && email === session.user.email) {
      //populateXData();
      populateAllAnalytics();
    }
  }, [lastUpdateOfX]);

  return { loading, allChartsData };
}
