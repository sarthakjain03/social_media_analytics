"use client";
import AreaChart from "../charts/AreaChart";
import { useUserStore } from "@/store/user";
import { useState, useEffect } from "react";
import { Instagram } from "@mui/icons-material";
import { CircularProgress, Box, Grid2 } from "@mui/material";
import { formatToDayMonthYear } from "@/utils/dateFormatters";
import { useSession } from "next-auth/react";

const chartColors = [
  "#1f77b4",
  "#2ca02c",
  "#d62728",
  "#ff7f0e",
  "#8c564b",
  "#9467bd",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

const InstagramTabContent = () => {
  const { data: session } = useSession();
  const { isInstagramConnected, email } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<{
    xaxisLabels: string[];
    data: Array<{ name: string; data: Array<number> }>;
  }>({
    xaxisLabels: [],
    data: [],
  });

//   if (!isInstagramConnected) {
//     return (
//       <div className="flex gap-4 items-center justify-center my-3">
//         <button
//           onClick={() => {}}
//           className="rounded-lg bg-black text-white font-poppins font-medium flex gap-2 py-2 px-3 items-center"
//         >
//           <span>Link</span>
//           <span>
//             <Instagram fontSize="small" />
//           </span>
//           <span>Account</span>
//         </button>
//       </div>
//     );
//   }

  return (
    <div className="font-poppins font-medium text-6xl flex items-center justify-center text-gray-500/20 mt-16 flex-grow">
        Coming Soon...
    </div>
  );
};

export default InstagramTabContent;
