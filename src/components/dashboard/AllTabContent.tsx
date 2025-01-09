"use client";
import dynamic from "next/dynamic";
import AreaChart from "../charts/AreaChart";
import LineChart from "../charts/LineChart";
import { useState, useEffect } from "react";
import { Box, Grid2, Skeleton } from "@mui/material";
import { formatToDayMonthYear } from "@/utils/dateFormatters";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/store/user";
import { ChartObject, ChartSeriesObject } from "@/types/Charts";
import { updateXUserData } from "@/actions/twitterActions";
import AccountLinkButtons from "./AccountLinkButtons";

// const AccountLinkButtons = dynamic(
//   // as I am using 'window' i.e. browser API in these components
//   () => import("@/components/dashboard/AccountLinkButtons"),
//   { ssr: false }
// );

const AllTabContent = () => {
  const { data: session } = useSession();
  const {
    isXConnected,
    email,
    isInstagramConnected,
    isLinkedinConnected,
    isYoutubeConnected,
    setUser,
    lastUpdateOfX,
  } = useUserStore();
  const [loading, setLoading] = useState(false);

  const updateTwitterUserData = async () => {
    if (lastUpdateOfX === null || Date.now() - Number(lastUpdateOfX) >= 900000) { // 15 mins gap
      const newUpdateOfX = await updateXUserData(session?.user?.email as string);

      setUser({ lastUpdateOfX: newUpdateOfX });
    }
  };

  useEffect(() => {
    // update all social media's data
    const updateAllData = async () => {
      setLoading(true);
      if (isXConnected) {
        await updateTwitterUserData();
      }
      setLoading(false);
    }

    if (session?.user && email === session.user.email) {
      updateAllData();
    }
  }, [isXConnected, session, email]);

  return (
    <>
      <AccountLinkButtons />
      {loading ? (
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <Grid2 container spacing={3}>
            {[1, 2, 3, 4]?.map((data) => (
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
