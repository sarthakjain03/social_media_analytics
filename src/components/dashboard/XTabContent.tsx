"use client";
import AreaChart from "../charts/AreaChart";
import LineChart from "../charts/LineChart";
import { useUserStore } from "@/store/user";
import { useState, useEffect } from "react";
import { X } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { getXUserData } from "@/actions/twitterActions";
import { ChartObject, TwitterChartData } from "@/types/TwitterData";
import { formatToDayMonthYear } from "@/utils/dateFormatters";
import { useSession } from "next-auth/react";

const XTabContent = () => {
    const { data: session } = useSession();
  const { isXConnected, email } = useUserStore();
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState<{
        xaxisLabels: string[];
        data: Array<{ name: string, data: Array<number> }>;
    }>({
        xaxisLabels: [],
        data: []
    });

    const formatChartData = (data: TwitterChartData) => {
        const dataObj = {
            likes: { name: "Likes", data: [] },
            impressions: { name: "Impressions", data: [] },
            bookmarks: { name: "Bookmarks", data: [] },
            replies: { name: "Replies", data: [] },
            retweets: { name: "Retweets", data: [] },
            engagements: { name: "Engagements", data: [] }
        };
        const labels: string[] = [];
        Object.keys(data)?.map((metric) => {
            const arr = (data as any)[metric];
            arr.map((obj: ChartObject) => {
                if (labels.length < arr.length) {
                    labels.push(formatToDayMonthYear(obj.date));
                }
                (dataObj as any)[metric].data.push(obj.value);
            });
        });
        setChartData({
            xaxisLabels: labels,
            data: Object.values(dataObj)
        });
    };

    const getChartsData = async () => {
        setLoading(true);
        const data = await getXUserData(email as string);
        if (data) {
            formatChartData(data);
        }
        setLoading(false);
    }

  const getXUrlAndRedirect = () => {
    window.location.href = "/api/twitter/get-auth-url";
  };

  useEffect(() => {
    if (session?.user && isXConnected && email === session.user.email) {
        getChartsData();
    }
  }, [email, isXConnected, session]);

  if (!isXConnected) {
    return (
        <div className="flex gap-4 items-center justify-center my-3">
          <button
            onClick={getXUrlAndRedirect}
            className="rounded-lg bg-black text-white font-poppins font-medium flex gap-2 py-2 px-3 items-center"
          >
            <span>Link</span>
            <span>
              <X fontSize="small" />
            </span>
            <span>Account</span>
          </button>
      </div>  
    );
  }

  return (
    <div className="flex gap-4 items-center justify-center my-3">
      {loading ? (
        <div className="flex justify-center items-center w-full">
            <CircularProgress color="secondary" />
        </div>
      ) : (
        <>
            <AreaChart height={450} xaxisLabels={chartData?.xaxisLabels ?? []} data={chartData?.data ?? []} />
        </>
      )}
    </div>
  );
};

export default XTabContent;
