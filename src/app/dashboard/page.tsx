"use client";
import DashboardTabs from "@/components/DashboardTabs";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getXAccessToken, getXUserData } from "@/actions/twitterActions";
import { motion } from "motion/react";
import { useUserStore } from "@/store/user";
import { CircularProgress } from "@mui/material";

export default function Dashboard() {
  const [openTab, setOpenTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { setUser, isXConnected, lastUpdateOfX } = useUserStore();

  // Function for getting code for X account linking from url
  const getXTokenAndRedirect = async () => {
    const state = searchParams.get("state");
    const code = searchParams.get("code");

    if (state && code && session?.user) {
      const connected = await getXAccessToken(state, code, session.user.email ?? "");
      if (connected) {
        setUser({ isXConnected: true });
      }
      router.replace("/dashboard?tab=all");
    }
  };

  const getXUrlAndRedirect = () => {
    window.location.href = '/api/twitter/get-auth-url';
  };

  const updateXUserData = async () => {
    if (Date.now() - Number(lastUpdateOfX) >= 900000) { // 15 mins gap
      setLoading(true);
      const newUpdateOfX = await getXUserData(session?.user?.email as string);
      if (newUpdateOfX) {
        console.log("Inside update X User data func: ", newUpdateOfX);
        
        setUser({ lastUpdateOfX: newUpdateOfX });
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session?.user) {
      if (!isXConnected) {
        getXTokenAndRedirect();
      }

      updateXUserData();
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
      <DashboardTabs selected={openTab} />
      {loading ? (
        <div className="flex justify-center items-center w-full">
          <CircularProgress color="secondary" />
        </div>
      ) : (
        <button onClick={getXUrlAndRedirect}>
          Add X (Formerly Twitter)
        </button>
      )}
    </motion.div>
  );
}
