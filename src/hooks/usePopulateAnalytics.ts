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
    const { isXConnected, isInstagramConnected, isLinkedinConnected, isYoutubeConnected, email } = useUserStore();
    const { setAnalytics, lastUpdate, xData } = useAnalyticsStore();

    const populateAnalytics = useCallback(async () => {
        if (lastUpdate === null || Date.now() - Number(lastUpdate) >= 86400000) {
            setLoading(true);
            let currentXData: TwitterChartData | null = xData ? xData : null;

            if (isXConnected && currentXData === null) {
                const xDataFromDB = await getXUserData(email as string);
                if (xDataFromDB?.chartsData) {
                    currentXData = xDataFromDB.chartsData;
                }
            }

            setXChartData(currentXData);

            if (setAnalytics) {
                setAnalytics({ xData: currentXData, lastUpdate: new Date() });
            }
        }
        setLoading(false);
    }, [lastUpdate, email, isXConnected, xData]);

    useEffect(() => {
        if (session?.user && email === session.user.email) {
            populateAnalytics();
        }
    }, [session, email]);

    return { loading, xChartData };
}
