"use client";
import dynamic from "next/dynamic";
import AreaChart from "@/components/charts/AreaChart";
import { useState, useEffect } from "react";
import { Box, Grid2, Skeleton } from "@mui/material";
import { formatToDayMonthYear } from "@/utils/dateFormatters";
import { usePopulateAnalytics } from "@/hooks/usePopulateAnalytics";
import { AllChartsData, AllTabCardsData, ChartObject } from "@/types/Charts";
import { useAnalyticsStore } from "@/store/analytics";
import MetricCard from "@/components/MetricCard";

const chartColors = [
  "#000000", // for X (Twitter)
  "#1f77b4", // for LinkedIn
  "#9467bd", // for Instagram
];

const AccountLinkButtons = dynamic(
  // as I am using 'window' i.e. browser API in these components
  () => import("@/app/dashboard/(content)/AccountLinkButtons"),
  { ssr: false }
);

const AllTabContent = () => {
  const { isHydrated } = useAnalyticsStore();
  const { loading, allChartsData } = usePopulateAnalytics();
  const [allAnalyticsData, setAllAnalyticsData] = useState<{
    xaxisLabels: string[];
    metricData: AllChartsData;
  } | null>(null);
  const [cardsData, setCardsData] = useState<AllTabCardsData | null>(null);
  // Total 3 cards of followers, impressions, likes

  const formatAllChartData = () => {
    const { xChartData, instagramChartData, linkedinChartData } = allChartsData;
    const chartsData: { xaxisLabels: string[]; metricData: AllChartsData; } = {
      xaxisLabels: [],
      metricData: { likes: [], replies: [], bookmarks: [], reposts: [], followers: [], impressions: [] }
    };
    
    if (xChartData) {
      Object.keys(chartsData.metricData)?.forEach((metric) => {
        const metricKey = metric as keyof AllChartsData;
        chartsData.metricData[metricKey].push({ name: "X (Twitter)", data: [] });
      });

      Object.keys(xChartData)?.forEach((metric) => {
        const arr: ChartObject[] = (xChartData as any)[metric];
        arr?.forEach((obj: ChartObject) => {
          if (chartsData?.xaxisLabels?.length < arr.length) {
            chartsData.xaxisLabels.push(formatToDayMonthYear(obj.date));
          }

          if (metric !== "engagements") {
            const key = metric as keyof AllChartsData;
            chartsData.metricData[key][0].data?.push(obj.value);
          }
        });
      });
    }
    
    setAllAnalyticsData(chartsData);
  };

  useEffect(() => {
    if (allChartsData) {
      setCardsData(allChartsData.cardsData);
      formatAllChartData();
    }
  }, [allChartsData]);

  return (
    <div className="flex flex-col gap-4 items-center justify-center mt-6 mb-20 w-full">
      {!loading && isHydrated && <AccountLinkButtons />}
      {loading || !allAnalyticsData ? (
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <Grid2 container spacing={3}>
            {[1, 2, 3]?.map((data) => (
              <Grid2 key={`${data}-card-skeleton`} size={{ xs: 12, lg: 4 }}>
                <Skeleton variant="rounded" height={150} width={"100%"} />
              </Grid2>
            ))}
            {[1, 2, 3, 4, 5, 6]?.map((data) => (
              <Grid2 key={`${data}-skeleton`} size={{ xs: 12, md: 6, xl: 4 }}>
                <Skeleton variant="rounded" height={480} width={"100%"} />
              </Grid2>
            ))}
          </Grid2>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          {allAnalyticsData && cardsData && (
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, lg: 4 }}>
                <MetricCard
                  comparisonDate={cardsData.comparisonDate}
                  title={cardsData.followers.title}
                  value={cardsData.followers.value}
                  percentChange={cardsData.followers.percentChange}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, lg: 4 }}>
                <MetricCard
                  comparisonDate={cardsData.comparisonDate}
                  title={cardsData.impressions.title}
                  value={cardsData.impressions.value}
                  percentChange={cardsData.impressions.percentChange}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, lg: 4 }}>
                <MetricCard
                  comparisonDate={cardsData.comparisonDate}
                  title={cardsData.likes.title}
                  value={cardsData.likes.value}
                  percentChange={cardsData.likes.percentChange}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6, xl: 4 }}>
                <AreaChart
                  title="Followers"
                  xaxisLabels={allAnalyticsData?.xaxisLabels ?? []}
                  colors={chartColors}
                  showLegendForSingleSeries={true}
                  data={allAnalyticsData?.metricData?.followers ?? []}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6, xl: 4 }}>
                <AreaChart
                  title="Likes"
                  xaxisLabels={allAnalyticsData?.xaxisLabels ?? []}
                  colors={chartColors}
                  showLegendForSingleSeries={true}
                  data={allAnalyticsData?.metricData?.likes ?? []}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6, xl: 4 }}>
                <AreaChart
                  title="Impressions"
                  xaxisLabels={allAnalyticsData?.xaxisLabels ?? []}
                  colors={chartColors}
                  showLegendForSingleSeries={true}
                  data={allAnalyticsData?.metricData?.impressions ?? []}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6, xl: 4 }}>
                <AreaChart
                  title="Replies"
                  xaxisLabels={allAnalyticsData?.xaxisLabels ?? []}
                  colors={chartColors}
                  showLegendForSingleSeries={true}
                  data={allAnalyticsData?.metricData?.replies ?? []}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6, xl: 4 }}>
                <AreaChart
                  title="Reposts"
                  xaxisLabels={allAnalyticsData?.xaxisLabels ?? []}
                  colors={chartColors}
                  showLegendForSingleSeries={true}
                  data={allAnalyticsData?.metricData?.reposts ?? []}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6, xl: 4 }}>
                <AreaChart
                  title="Bookmarks"
                  xaxisLabels={allAnalyticsData?.xaxisLabels ?? []}
                  colors={chartColors}
                  showLegendForSingleSeries={true}
                  data={allAnalyticsData?.metricData?.bookmarks ?? []}
                />
              </Grid2>
            </Grid2>
          )}
        </Box>
      )}
    </div>
  );
};

export default AllTabContent;
