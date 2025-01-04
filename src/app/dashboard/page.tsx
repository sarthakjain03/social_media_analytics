"use client";
import DashboardTabs from "@/components/DashboardTabs";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getXAccessToken, getXUserData } from "@/actions/twitterActions";
import { motion } from "motion/react";
import { useUserStore } from "@/store/user";

export default function Dashboard() {
  const [openTab, setOpenTab] = useState("all");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { setUser } = useUserStore();

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

  useEffect(() => {
    if (session?.user) {
      getXTokenAndRedirect();

      // TODO: this function is called here for trial only
      getXUserData(session.user.email as string);
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
      <button onClick={getXUrlAndRedirect}>
        Add X (Formerly Twitter)
      </button>
    </motion.div>
  );
}
