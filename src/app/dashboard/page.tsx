"use client"
import DashboardTabs from "@/components/DashboardTabs";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getAccessToken } from "@/actions/twitterActions";

export default function Dashboard() {
    const [openTab, setOpenTab] = useState("all")
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session } = useSession();

    const getTokenAndRedirect = async () => {
        const state = searchParams.get("state");
        const code = searchParams.get("code");

        if (state && code && session?.user) {
            await getAccessToken(state, code, session.user.email ?? "");
            router.replace("/dashboard?tab=all");
        }
    };

    useEffect(() => {
        getTokenAndRedirect();

        const tab = searchParams.get("tab");
        if (tab) {
            setOpenTab(tab);
        }
    }, [searchParams]);

    return (
        <div>
            <DashboardTabs selected={openTab} />
        </div>
    );
}