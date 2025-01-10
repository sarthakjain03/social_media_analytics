"use client";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getXAccessToken, updateXUserData } from "@/actions/twitterActions";
import { motion } from "motion/react";
import { useUserStore } from "@/store/user";
import { useAnalyticsStore } from "@/store/analytics";
import dynamic from "next/dynamic";
import { Skeleton, Box, Grid2 } from "@mui/material";

const AllTabContent = dynamic(
  () => import("@/components/dashboard/AllTabContent"),
  { ssr: false }
);
const InstagramTabContent = dynamic(
  () => import("@/components/dashboard/InstagramTabContent"),
  { ssr: false }
);
const LinkedinTabContent = dynamic(
  () => import("@/components/dashboard/LinkedinTabContent"),
  { ssr: false }
);
const YoutubeTabContent = dynamic(
  () => import("@/components/dashboard/YoutubeTabContent"),
  { ssr: false }
);
const XTabContent = dynamic(
  () => import("@/components/dashboard/XTabContent"),
  { ssr: false }
); // ssr = server side render, as here I am using 'window' i.e. browser-only API in this component which cannot be pre-rendered on the server as these apis don't exist on the server side.

export default function Dashboard() {
  const [openTab, setOpenTab] = useState("all");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const {
    isXConnected,
    email,
    isInstagramConnected,
    isLinkedinConnected,
    isYoutubeConnected,
    setUser
  } = useUserStore();
  const { lastUpdateOfX, setAnalytics } = useAnalyticsStore();
  const [loading, setLoading] = useState(false);

  // Function for getting code for X account linking from url
  const getXTokenAndRedirect = async () => {
    const state = searchParams.get("state");
    const code = searchParams.get("code");

    if (state && code && session?.user) {
      const connected = await getXAccessToken(
        state,
        code,
        session.user.email ?? ""
      );
      if (connected) {
        setUser({ isXConnected: true });
      }
      router.replace("/dashboard?tab=all");
    }
  };

  useEffect(() => {
    // update all social media's analytics data
    const updateAllAnalyticsData = async () => {
      setLoading(true);
      let hasXDataUpdated = false;

      if (lastUpdateOfX === null || Date.now() - Number(lastUpdateOfX) >= 86400000) { // 24 hrs gap
        if (isXConnected) {
          hasXDataUpdated = await updateXUserData(session?.user?.email as string);
        }
      }

      if (hasXDataUpdated) {
        setAnalytics({ lastUpdateOfX: new Date() });
      }
      setLoading(false);
    }

    if (session?.user && email === session.user.email) {
      updateAllAnalyticsData();
    }
  }, [isXConnected, session, email]);

  useEffect(() => {
    if (session?.user) {
      if (!isXConnected) {
        getXTokenAndRedirect();
      }
    }

    const tab = searchParams.get("tab");
    if (tab) {
      setOpenTab(tab);
    }
  }, [searchParams, session]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="px-20"
    >
      {loading ? (
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <Grid2 container spacing={5}>
            <Grid2 size={{ xs: 12 }}>
              <Skeleton variant="rounded" width={"100%"} height={105} />
            </Grid2>
            <Grid2 container spacing={3} size={{ xs: 12 }} width={"100%"}>
              {[1, 2, 3, 4, 5, 6]?.map((data) => (
                <Grid2 key={`${data}-dashboard-skeleton`} size={{ xs: 12, md: 6, xl: 4 }}>
                  <Skeleton variant="rounded" width={"100%"} height={461} />
                </Grid2>
              ))}
            </Grid2>
          </Grid2>
        </Box>
      ) : (
        <>
          <DashboardTabs selected={openTab} />
          {openTab === "all" && <AllTabContent />}
          {openTab === "twitter" && <XTabContent />}
          {openTab === "instagram" && <InstagramTabContent />}
          {openTab === "linkedin" && <LinkedinTabContent />}
          {openTab === "youtube" && <YoutubeTabContent />}
        </>
      )}
    </motion.div>
  );
}
