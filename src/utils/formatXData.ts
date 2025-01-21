import { TwitterUserData } from "@/types/TwitterData";
import { ChartObject, ChartData } from "@/types/Charts";
import { formatToDatabaseDate } from "./dateFormatters";

export const formatUserData = (data: any) => {
    const returnObj: TwitterUserData = {
        followers: data?.public_metrics?.followers_count,
        x_id: data?.id
    }

    return returnObj;
};

export const getMetricTotals = (dataArray: any) => {
    const totals = {
        totalLikes: 0,
        totalImpressions: 0,
        totalRetweets: 0,
        totalBookmarks: 0,
        totalReplies: 0,
        totalEngagements: 0
    };

    dataArray?.map((data: any) => {
        totals.totalLikes = totals.totalLikes + data.public_metrics.like_count;
        totals.totalBookmarks = totals.totalBookmarks + data.public_metrics.bookmark_count;
        totals.totalEngagements = totals.totalEngagements + data.non_public_metrics.engagements;
        totals.totalImpressions = totals.totalImpressions + data.public_metrics.impression_count;
        totals.totalReplies = totals.totalReplies + data.public_metrics.reply_count;
        totals.totalRetweets = totals.totalRetweets + data.public_metrics.retweet_count;
    });

    return totals;
};

export const formatChartData = (metricTotals: {
    totalLikes: number;
    totalImpressions: number;
    totalRetweets: number;
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
            value: metricTotals.totalRetweets
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
        // Metric Gained = Current value - LastAddedValue.
        // For ex: Likes Gained = Current Likes on the Post - LastAddedValue in the db.
        Object.keys(metricTotals.prevChartsData)?.map((metric) => {
            const metricKey = metric as keyof ChartData;
            const metricData = metricTotals.prevChartsData?.[metricKey] ?? [];
            const len = metricData?.length;

            if (len > 0 && metricKey !== "followers") {
                const diff = obj[metricKey].value - metricData[len-1].value;
                obj[metricKey].value = Math.max(diff, 0);
            }
        });

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

// non-public-metrics only appear for posts not older than 30 days.
// posts metrics data who are older than 30 days might not appear in the api responses.
// use the /tweets api to get data of multiple posts at once through their ids.

// try setting up a cron job that updates data of all users in the db with a 15-min delay between each user's api call

// Currently doing: Just call the api and get the metrics for the latest 10 posts (will return 4 most probably, not sure though) and get the new post ids. Store the post ids of the latest posts returned by the api request and update those posts metrics data.
