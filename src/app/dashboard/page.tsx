"use client";
import DashboardTabs from "@/app/dashboard/(content)/DashboardTabs";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getXAccessToken } from "@/actions/twitterActions";
import { getIGShortLivedAccessToken } from "@/actions/instagramActions";
import { motion } from "motion/react";
import { useUserStore } from "@/store/user";
import { useAnalyticsStore } from "@/store/analytics";
import dynamic from "next/dynamic";
import { Skeleton, Box, Grid2, Alert } from "@mui/material";
import { getNextUpdateDateTime } from "@/utils/dateFormatters";
import { X, Instagram } from "@mui/icons-material";
import { grey, pink, purple, orange } from "@mui/material/colors";
import showToast from "@/utils/toast";

const AllTabContent = dynamic(
  () => import("@/app/dashboard/(content)/AllTabContent"),
  { ssr: false }
);
const InstagramTabContent = dynamic(
  () => import("@/app/dashboard/(content)/InstagramTabContent"),
  { ssr: false }
);
const LinkedinTabContent = dynamic(
  () => import("@/app/dashboard/(content)/LinkedinTabContent"),
  { ssr: false }
);
const XTabContent = dynamic(
  () => import("@/app/dashboard/(content)/XTabContent"),
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
    setUser,
  } = useUserStore();
  const { lastUpdateOfX, lastUpdateOfInstagram } = useAnalyticsStore();
  const [loading, setLoading] = useState(false);
  const [nextUpdateTime, setNextUpdateTime] = useState({
    twitter: "",
    //linkedin: "",
    instagram: ""
  });

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

  // Function for getting code for Instagram account linking from url
  const getInstagramTokenAndRedirect = async () => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      showToast("error", error?.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
    } else if (code && session?.user) {
      const connectedIG = await getIGShortLivedAccessToken(code, session.user.email ?? "");
      if (connectedIG) {
        setUser({ isInstagramConnected: true });
      }
      router.replace("/dashboard?tab=all");
    }
  };

  useEffect(() => {
    if (session?.user && email === session.user.email) {
      setNextUpdateTime((prev) => ({
        ...prev,
        twitter: lastUpdateOfX ? getNextUpdateDateTime(lastUpdateOfX) : "",
        instagram: lastUpdateOfInstagram ? getNextUpdateDateTime(lastUpdateOfInstagram) : ""
      }));
    }
  }, [session, email, lastUpdateOfX, lastUpdateOfInstagram]);

  useEffect(() => {
    if (session?.user) {
      if (!isXConnected) {
        getXTokenAndRedirect();
      }
      if (!isInstagramConnected) {
        getInstagramTokenAndRedirect();
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
                <Grid2
                  key={`${data}-dashboard-skeleton`}
                  size={{ xs: 12, md: 6, xl: 4 }}
                >
                  <Skeleton variant="rounded" width={"100%"} height={480} />
                </Grid2>
              ))}
            </Grid2>
          </Grid2>
        </Box>
      ) : (
        <>
          <Box sx={{ flexGrow: 1, width: "100%", marginBottom: "0.75rem", marginTop: "0.5rem" }}>
            <Grid2 container spacing={3}>
              {nextUpdateTime?.twitter && (
                <Grid2 size={{ xs: 12 }}>
                  <Alert
                    severity="info"
                    onClose={() =>
                      setNextUpdateTime((prev) => ({ ...prev, twitter: "" }))
                    }
                    icon={<X fontSize="inherit" style={{ color: 'black' }} />}
                    sx={{ color: "black", borderColor: "black", backgroundColor: grey[200] }}
                  >
                    {`Analytics will be updated when you login or refresh after ${nextUpdateTime?.twitter}`}
                  </Alert>
                </Grid2>
              )}
              {nextUpdateTime?.instagram && (
                <Grid2 size={{ xs: 12 }}>
                  <Alert
                    severity="info"
                    onClose={() =>
                      setNextUpdateTime((prev) => ({ ...prev, instagram: "" }))
                    }
                    icon={
                      <Instagram
                        fontSize="inherit"
                        style={{ color: `linear-gradient(45deg, ${pink[500]}, ${purple[500]}, ${orange[500]})` }}
                      />
                    }
                    sx={{
                      color: "white",
                      borderColor: purple[500],
                      backgroundColor: `linear-gradient(45deg, ${pink[500]}, ${purple[500]}, ${orange[500]})`
                    }}
                  >
                    {`Analytics will be updated when you login or refresh after ${nextUpdateTime?.instagram}`}
                  </Alert>
                </Grid2>
              )}
            </Grid2>
          </Box>
          <DashboardTabs selected={openTab} />
          {openTab === "all" && <AllTabContent />}
          {openTab === "twitter" && <XTabContent />}
          {openTab === "instagram" && <InstagramTabContent />}
          {openTab === "linkedin" && <LinkedinTabContent />}
        </>
      )}
    </motion.div>
  );
}
