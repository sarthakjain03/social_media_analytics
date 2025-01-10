import { AnalyticsStore, UserStore } from "@/types/Stores";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getXUserData } from "@/actions/twitterActions";
import { TwitterChartData } from "@/types/Charts";

export function usePopulateAnalytics({ analyticsStore, userStore } : {
    analyticsStore: Partial<AnalyticsStore>;
    userStore: Partial<UserStore>
}) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const { isXConnected, isInstagramConnected, isLinkedinConnected, isYoutubeConnected, email } = userStore;
    const { setAnalytics, lastUpdate, xData } = analyticsStore;

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

    return { loading };
}
