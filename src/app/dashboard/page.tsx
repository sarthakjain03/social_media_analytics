"use client";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getXAccessToken } from "@/actions/twitterActions";
import { motion } from "motion/react";
import { useUserStore } from "@/store/user";
import dynamic from "next/dynamic";

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
  const { setUser, isXConnected } = useUserStore();

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
      <DashboardTabs selected={openTab} />
      {openTab === "all" && <AllTabContent />}
      {openTab === "twitter" && <XTabContent />}
      {openTab === "instagram" && <InstagramTabContent />}
      {openTab === "linkedin" && <LinkedinTabContent />}
      {openTab === "youtube" && <YoutubeTabContent />}
    </motion.div>
  );
}
