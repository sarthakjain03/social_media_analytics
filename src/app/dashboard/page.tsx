"use client"
import DashboardTabs from "@/components/DashboardTabs";
import { useState } from "react";

export default function Dashboard() {
    const [openTab, setOpenTab] = useState("X (Twitter)")

    return (
        <div>
            <DashboardTabs selected={openTab} setSelected={setOpenTab} />
        </div>
    );
}