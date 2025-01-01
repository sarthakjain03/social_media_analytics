"use client";
import DashboardTabs from "@/components/DashboardTabs";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getAccessToken, getAuthUrl } from "@/actions/twitterActions";
import { motion } from "motion/react";

export default function Dashboard() {
  const [openTab, setOpenTab] = useState("all");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const getTokenAndRedirect = async () => {
    const state = searchParams.get("state");
    const code = searchParams.get("code");

    console.log(state, code);

    if (state && code && session?.user) {
      await getAccessToken(state, code, session.user.email ?? "");
      router.replace("/dashboard?tab=all");
    }
  };

  const getTwitterUrlAndRedirect = () => {
    window.location.href = '/api/twitter/get-auth-url';
  };

  useEffect(() => {
    console.log("Inside useEffect for search params");
    getTokenAndRedirect();

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
      <button onClick={getTwitterUrlAndRedirect}>
        Add X (Formerly Twitter)
      </button>
    </motion.div>
  );
}
