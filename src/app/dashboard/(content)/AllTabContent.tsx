"use client";
import dynamic from "next/dynamic";
import AreaChart from "@/components/charts/AreaChart";
import { useState, useEffect } from "react";
import { Box, Grid2, Skeleton } from "@mui/material";
import { formatToDayMonthYear } from "@/utils/dateFormatters";
import { usePopulateAnalytics } from "@/hooks/usePopulateAnalytics";
import { ChartObject } from "@/types/Charts";

const chartColors = [
  "#000000", // for X (Twitter)
  "#1f77b4", // for LinkedIn
  "#9467bd", // for Instagram
];

interface AllChartsData {
  likes: Array<{ name: string; data: number[] }>;
  replies: Array<{ name: string; data: number[] }>;
  bookmarks: Array<{ name: string; data: number[] }>;
  reposts: Array<{ name: string; data: number[] }>; // retweets for X (Twitter)
  followers: Array<{ name: string; data: number[] }>;
  impressions: Array<{ name: string; data: number[] }>;
}

const AccountLinkButtons = dynamic(
  // as I am using 'window' i.e. browser API in these components
  () => import("@/app/dashboard/(content)/AccountLinkButtons"),
  { ssr: false }
);

const AllTabContent = () => {
  const { loading, allChartsData } = usePopulateAnalytics();
  const [allAnalyticsData, setAllAnalyticsData] = useState<{
    xaxisLabels: string[];
    metricData: AllChartsData;
  }>({
    xaxisLabels: [],
    metricData: {
      likes: [{ name: "X (Twitter)", data: [] },],
      replies: [{ name: "X (Twitter)", data: [] },],
      bookmarks: [{ name: "X (Twitter)", data: [] },],
      reposts: [{ name: "X (Twitter)", data: [] },], // retweets for X (Twitter)
      followers: [{ name: "X (Twitter)", data: [] },],
      impressions: [{ name: "X (Twitter)", data: [] },],
    }
  });

  const formatAllChartData = () => {
    const { xChartData } = allChartsData;
    const chartsData: {
      xaxisLabels: string[];
      metricData: AllChartsData;
    } = {
      xaxisLabels: [],
      metricData: {
        likes: [{ name: "X (Twitter)", data: [] },],
        replies: [{ name: "X (Twitter)", data: [] },],
        bookmarks: [{ name: "X (Twitter)", data: [] },],
        reposts: [{ name: "X (Twitter)", data: [] },], // retweets for X (Twitter)
        followers: [{ name: "X (Twitter)", data: [] },],
        impressions: [{ name: "X (Twitter)", data: [] },],
      }
    };
    
    if (xChartData) {
      Object.keys(xChartData)?.forEach((metric) => {
        const arr: ChartObject[] = (xChartData as any)[metric];
        arr?.forEach((obj: ChartObject) => {
          if (chartsData?.xaxisLabels?.length < arr.length) {
            chartsData.xaxisLabels.push(formatToDayMonthYear(obj.date));
          }
          if (metric === "retweets") {
            chartsData.metricData.reposts[0].data.push(obj.value);
          } else if (metric !== "engagements") {
            const key = metric as keyof AllChartsData;
            chartsData.metricData[key][0].data?.push(obj.value);
          }
        });
      });
    }
    
    setAllAnalyticsData(chartsData);
  };

  useEffect(() => {
    formatAllChartData();
  }, [allChartsData]);

  // TODO: If no social media is linked, show nothing here

  return (
    <div className="flex gap-4 items-center justify-center mt-12 mb-20 w-full">
      <AccountLinkButtons />
      {loading ? (
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <Grid2 container spacing={3}>
            {[1, 2, 3, 4, 5, 6]?.map((data) => (
              <Grid2 key={`${data}-skeleton`} size={{ xs: 12, md: 6, xl: 4 }}>
                <Skeleton variant="rounded" height={480} width={"100%"} />
              </Grid2>
            ))}
          </Grid2>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <Grid2 container spacing={3}>
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
        </Box>
      )}
    </div>
  );
};

export default AllTabContent;
