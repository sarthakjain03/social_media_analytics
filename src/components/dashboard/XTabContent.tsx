"use client";
import AreaChart from "../charts/AreaChart";
import { useUserStore } from "@/store/user";
import { useState, useEffect } from "react";
import { X } from "@mui/icons-material";
import { Box, Grid2, Skeleton } from "@mui/material";
import { getXUserData } from "@/actions/twitterActions";
import { ChartObject, TwitterChartData, ChartSeriesObject } from "@/types/Charts";
import { formatToDayMonthYear } from "@/utils/dateFormatters";
import { useSession } from "next-auth/react";

const chartColors = [
  "#1f77b4",
  "#2ca02c",
  "#d62728",
  "#ff7f0e",
  "#8c564b",
  "#9467bd",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const XTabContent = () => {
  const { data: session } = useSession();
  const { isXConnected, email } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<{
    xaxisLabels: string[];
    data: ChartSeriesObject[];
  }>({
    xaxisLabels: [],
    data: [],
  });
  const [delayExecuting, setDelayExecuting] = useState(false);

  const formatChartData = (data: TwitterChartData) => {
    const dataObj = {
      followers: { name: "Followers", data: [] },
      likes: { name: "Likes", data: [] },
      impressions: { name: "Impressions", data: [] },
      bookmarks: { name: "Bookmarks", data: [] },
      replies: { name: "Replies", data: [] },
      retweets: { name: "Retweets", data: [] },
      engagements: { name: "Engagements", data: [] }
    };
    const labels: string[] = [];
    Object.keys(data)?.map((metric) => {
      const arr = (data as any)[metric];
      arr.map((obj: ChartObject) => {
        if (labels.length < arr.length) {
          labels.push(formatToDayMonthYear(obj.date));
        }
        (dataObj as any)[metric].data.push(obj.value);
      });
    });
    setChartData({
      xaxisLabels: labels,
      data: Object.values(dataObj),
    });
  };

  const getChartsData = async () => {
    setDelayExecuting(true);
    setLoading(true);
    const data = await getXUserData(email as string);
    if (data?.chartsData) {
      formatChartData(data?.chartsData);
    }
    setLoading(false);
    await delay(16 * 60 * 1000); // atleast 16 mins gap between api calls.
    setDelayExecuting(false);
  };

  const getXUrlAndRedirect = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/api/twitter/get-auth-url";
    }
  };

  useEffect(() => {
    if (session?.user && isXConnected && email === session.user.email && !delayExecuting) {
      getChartsData();
    }
  }, [email, isXConnected, session, delayExecuting]);

  if (!isXConnected) {
    return (
      <div className="flex gap-4 items-center justify-center my-3">
        <button
          onClick={getXUrlAndRedirect}
          className="rounded-lg bg-black text-white font-poppins font-medium flex gap-2 py-2 px-3 items-center"
        >
          <span>Link</span>
          <span>
            <X fontSize="small" />
          </span>
          <span>Account</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-center justify-center mt-12 mb-20 w-full">
      {loading ? (
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          <Grid2 container spacing={3}>
            {[1, 2, 3, 4, 5, 6, 7, 8]?.map((data) => (
              <Grid2 key={`${data}-skeleton`} size={{ xs: 12, md: 6, xl: 4 }}>
                <Skeleton variant="rounded" height={461} width={"100%"} />
              </Grid2>
            ))}
          </Grid2>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 6, xl: 4 }}>
              <AreaChart
                title={"All Metrics"}
                colors={chartColors}
                xaxisLabels={chartData?.xaxisLabels ?? []}
                data={chartData?.data ?? []}
              />
            </Grid2>
            {chartData?.data?.map((data, index) => (
              <Grid2 key={data.name} size={{ xs: 12, md: 6, xl: 4 }}>
                <AreaChart
                  title={data.name}
                  colors={[chartColors[index]]}
                  xaxisLabels={chartData?.xaxisLabels ?? []}
                  data={[data]}
                />
              </Grid2>
            ))}
          </Grid2>
        </Box>
      )}
    </div>
  );
};

export default XTabContent;
