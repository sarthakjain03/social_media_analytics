"use client";
import dynamic from "next/dynamic";
import AreaChart from "../charts/AreaChart";
import LineChart from "../charts/LineChart";
import { useState, useEffect } from "react";
import { Box, Grid2, Skeleton } from "@mui/material";
import { formatToDayMonthYear } from "@/utils/dateFormatters";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/store/user";
import { useAnalyticsStore } from "@/store/analytics";
import { usePopulateAnalytics } from "@/hooks/usePopulateAnalytics";
import { ChartObject, ChartSeriesObject } from "@/types/Charts";

const AccountLinkButtons = dynamic(
  // as I am using 'window' i.e. browser API in these components
  () => import("@/components/dashboard/AccountLinkButtons"),
  { ssr: false }
);

const AllTabContent = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <AccountLinkButtons />
      {loading ? (
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <Grid2 container spacing={3}>
            {[1, 2, 3, 4, 5, 6]?.map((data) => (
              <Grid2 key={`${data}-skeleton`} size={{ xs: 12, md: 6, xl: 4 }}>
                <Skeleton variant="rounded" height={461} width={"100%"} />
              </Grid2>
            ))}
          </Grid2>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <Grid2 container spacing={3}>
            {/* <Grid2 size={{ xs: 12, md: 6, xl: 4 }}>
              <Skeleton variant="rounded" height={461} width={"100%"} />
            </Grid2> */}
          </Grid2>
        </Box>
      )}
    </>
  );
};

export default AllTabContent;
