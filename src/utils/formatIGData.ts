import { ChartObject, ChartData } from "@/types/Charts";
import { formatToDatabaseDate } from "./dateFormatters";

export const getInstagramMetricsData = (dataArray: any) => {
    const totals = {
        totalLikes: 0,
        totalImpressions: 0,
        totalShares: 0,
        totalBookmarks: 0,
        totalReplies: 0,
        totalEngagements: 0
    };

    const nameMapping = {
        accounts_engaged: "totalEngagements",
        comments: "totalEngagements",
        replies: "totalReplies",
        saves: "totalBookmarks",
        likes: "totalLikes",
        impressions: "totalImpressions",
        shares: "totalShares"
    }

    type MetricName = keyof typeof nameMapping;
    type TotalType = keyof typeof totals;

    dataArray?.forEach((item: any) => {
        const metric = item?.name as MetricName;
        const totalType = nameMapping[metric] as TotalType;
        if (totals[totalType] !== undefined) {
            totals[totalType] += item?.total_value?.value || 0;
        }
    });

    return totals;
}

export const formatIGChartData = (metricTotals: {
    totalLikes: number;
    totalImpressions: number;
    totalShares: number;
    totalBookmarks: number;
    totalReplies: number;
    totalEngagements: number;
    totalFollowers: number;
    prevChartsData: ChartData | null;
}) => {
    const dbDate = formatToDatabaseDate(new Date());
    const obj: { [key: string]: ChartObject } = {
        likes: {
            date: dbDate,
            value: metricTotals.totalLikes
        },
        reposts: {
            date: dbDate,
            value: metricTotals.totalShares
        },
        replies: {
            date: dbDate,
            value: metricTotals.totalReplies
        },
        bookmarks: {
            date: dbDate,
            value: metricTotals.totalBookmarks
        },
        engagements: {
            date: dbDate,
            value: metricTotals.totalEngagements
        },
        impressions: {
            date: dbDate,
            value: metricTotals.totalImpressions
        },
        followers: {
            date: dbDate,
            value: metricTotals.totalFollowers
        }
    };

    if (metricTotals.prevChartsData && Object.keys(metricTotals.prevChartsData).length > 0) {
        // Metrics are of per Day.

        const updatedChartData: ChartData = {
            likes: [...metricTotals.prevChartsData.likes, obj.likes],
            replies: [...metricTotals.prevChartsData.replies, obj.replies],
            reposts: [...metricTotals.prevChartsData.reposts, obj.reposts],
            engagements: [...metricTotals.prevChartsData.engagements, obj.engagements],
            impressions: [...metricTotals.prevChartsData.impressions, obj.impressions],
            bookmarks: [...metricTotals.prevChartsData.bookmarks, obj.bookmarks],
            followers: [...metricTotals.prevChartsData.followers, obj.followers]
        };
    
        return updatedChartData;
    }

    const updatedData: ChartData = {
        likes: [obj.likes],
        replies: [obj.replies],
        reposts: [obj.reposts],
        engagements: [obj.engagements],
        impressions: [obj.impressions],
        bookmarks: [obj.bookmarks],
        followers: [obj.followers]
    };

    return updatedData;
};