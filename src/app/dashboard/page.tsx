"use client"
import DashboardTabs from "@/components/DashboardTabs";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Dashboard() {
    const [openTab, setOpenTab] = useState("all")
    const searchParams = useSearchParams();

    useEffect(() => {
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