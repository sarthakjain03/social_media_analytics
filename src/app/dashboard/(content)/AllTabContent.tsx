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
  xaxisLabels: string[];
  likes: Array<{ name: string; data: number[] }>;
  replies: Array<{ name: string; data: number[] }>;
  bookmarks: Array<{ name: string; data: number[] }>;
  reposts: Array<{ name: string; data: number[] }>; // retweets for X (Twitter)
  followers: Array<{ name: string; data: number[] }>;
  impressions: Array<{ name: string; data: number[] }>;
}

const defaultChartData: Array<{ name: string; data: number[] }> = [
  { name: "X (Twitter)", data: [] },
  //{ name: "LinkedIn", data: [] },
  //{ name: "Instagram", data: [] }
];

const AccountLinkButtons = dynamic(
  // as I am using 'window' i.e. browser API in these components
  () => import("@/app/dashboard/(content)/AccountLinkButtons"),
  { ssr: false }
);

const AllTabContent = () => {
  const { loading, allChartsData } = usePopulateAnalytics();
  const [allAnalyticsData, setAllAnalyticsData] = useState<AllChartsData>({
    xaxisLabels: [],
    likes: defaultChartData,
    replies: defaultChartData,
    bookmarks: defaultChartData,
    reposts: defaultChartData, // retweets for X (Twitter)
    followers: defaultChartData,
    impressions: defaultChartData,
  });

  const formatAllChartData = () => {
    const { xChartData } = allChartsData;
    const chartsData: AllChartsData = {
      xaxisLabels: [],
      likes: defaultChartData,
      replies: defaultChartData,
      bookmarks: defaultChartData,
      reposts: defaultChartData, // retweets for X (Twitter)
      followers: defaultChartData,
      impressions: defaultChartData,
    };

    if (xChartData) {
      Object.keys(xChartData)?.map((metric) => {
        const arr = (xChartData as any)[metric];
        arr?.map((obj: ChartObject) => {
          if (chartsData?.xaxisLabels?.length < arr.length) {
            chartsData?.xaxisLabels?.push(formatToDayMonthYear(obj.date));
          }
          if (metric === "retweets") {
            chartsData.reposts[0].data.push(obj.value);
          } else if (metric !== "engagements") {
            (chartsData as any)[metric][0].data.push(obj.value);
          }
        });
      });
    }

    setAllAnalyticsData(chartsData);
  };

  useEffect(() => {
    formatAllChartData();
  }, [allChartsData]);

  return (
    <>
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
                data={allAnalyticsData?.followers ?? []}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6, xl: 4 }}>
              <AreaChart
                title="Likes"
                xaxisLabels={allAnalyticsData?.xaxisLabels ?? []}
                colors={chartColors}
                showLegendForSingleSeries={true}
                data={allAnalyticsData?.likes ?? []}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6, xl: 4 }}>
              <AreaChart
                title="Impressions"
                xaxisLabels={allAnalyticsData?.xaxisLabels ?? []}
                colors={chartColors}
                showLegendForSingleSeries={true}
                data={allAnalyticsData?.impressions ?? []}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6, xl: 4 }}>
              <AreaChart
                title="Replies"
                xaxisLabels={allAnalyticsData?.xaxisLabels ?? []}
                colors={chartColors}
                showLegendForSingleSeries={true}
                data={allAnalyticsData?.replies ?? []}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6, xl: 4 }}>
              <AreaChart
                title="Reposts"
                xaxisLabels={allAnalyticsData?.xaxisLabels ?? []}
                colors={chartColors}
                showLegendForSingleSeries={true}
                data={allAnalyticsData?.reposts ?? []}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6, xl: 4 }}>
              <AreaChart
                title="Bookmarks"
                xaxisLabels={allAnalyticsData?.xaxisLabels ?? []}
                colors={chartColors}
                showLegendForSingleSeries={true}
                data={allAnalyticsData?.bookmarks ?? []}
              />
            </Grid2>
          </Grid2>
        </Box>
      )}
    </>
  );
};

export default AllTabContent;
