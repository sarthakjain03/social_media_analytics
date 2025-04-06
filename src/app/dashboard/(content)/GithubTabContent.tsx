"use client";
import AreaChart from "@/components/charts/AreaChart";
import { useUserStore } from "@/store/user";
import { useState, useEffect } from "react";
import { GitHub } from "@mui/icons-material";
import { Box, Grid2, Skeleton } from "@mui/material";
import { ChartObject, GithubChartData, ChartSeriesObject } from "@/types/Charts";
import { formatToDayMonthYear } from "@/utils/dateFormatters";
import { usePopulateAnalytics } from "@/hooks/usePopulateAnalytics";

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

const GithubTabContent = () => {
  const { isGithubConnected } = useUserStore();
  const { loading, allChartsData } = usePopulateAnalytics();

  const [chartData, setChartData] = useState<{
    xaxisLabels: string[];
    data: ChartSeriesObject[];
  }>({
    xaxisLabels: [],
    data: [],
  });

  const formatChartData = (data: GithubChartData) => {
    const dataObj: { [key: string]: ChartSeriesObject } = {
      followers: { name: "Followers", data: [] },
      stars: { name: "Stars", data: [] },
      contributions: { name: "Total Contributions", data: [] },
      commits: { name: "Commits", data: [] },
      pullRequests: { name: "Pull Requests", data: [] },
      issues: { name: "Issues", data: [] },
      // forks: { name: "Forks", data: [] }, // If you add it later
    };
  
    const labels: string[] = [];
  
    Object.entries(data).forEach(([metric, arr]) => {
      if (!dataObj[metric]) return; // Skip any unexpected key
  
      arr.forEach((obj: ChartObject, index: number) => {
        if (labels.length < arr.length) {
          labels.push(formatToDayMonthYear(obj.date));
        }
        dataObj[metric].data.push(obj.value);
      });
    });
  
    setChartData({
      xaxisLabels: labels,
      data: Object.values(dataObj),
    });
  };
  

  const githubAuthRedirect = async () => {
    if (typeof window !== "undefined") {
      const username = prompt("Enter your GitHub username:");
      if (username) {
        try {
          const response = await fetch("/api/github/link-account", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
          });

          const result = await response.json();
          if (result.success) {
            alert("GitHub account linked successfully!");
            window.location.reload();
          } else {
            alert(result.message || "Failed to link GitHub account.");
          }
        } catch (error) {
          alert("An error occurred while linking your GitHub account.");
        }
      }
    }
  };

  useEffect(() => {
    if (allChartsData?.githubChartData) {
      formatChartData(allChartsData.githubChartData);
    }
  }, [allChartsData]);

  if (!isGithubConnected) {
    return (
      <div className="flex gap-4 items-center justify-center my-3">
        <button
          onClick={githubAuthRedirect}
          className="rounded-lg bg-black text-white font-poppins font-medium flex gap-2 py-2 px-3 items-center"
        >
          <span>Link</span>
          <span>
            <GitHub fontSize="small" />
          </span>
          <span>Account</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-center justify-center mt-12 mb-20 w-full">
      {loading ? (
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <Grid2 container spacing={3}>
            {[1, 2, 3]?.map((data) => (
              <Grid2 key={`${data}-skeleton`} size={{ xs: 12, md: 6, xl: 4 }}>
                <Skeleton variant="rounded" height={480} width={"100%"} />
              </Grid2>
            ))}
          </Grid2>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          {chartData?.data?.length > 0 && (
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
          )}
        </Box>
      )}
    </div>
  );
};

export default GithubTabContent;
