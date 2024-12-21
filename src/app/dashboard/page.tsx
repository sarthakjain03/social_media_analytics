"use client"
import Header from "@/components/Header";
import DashboardTabs from "@/components/DashboardTabs";
import { useState } from "react";

export default function Dashboard() {
    const [openTab, setOpenTab] = useState("X (Twitter)")

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white font-poppins">
            <Header />
            <DashboardTabs selected={openTab} setSelected={setOpenTab} />
        </div>
    );
}