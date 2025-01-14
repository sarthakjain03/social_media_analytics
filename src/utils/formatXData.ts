import { TwitterUserData, TwitterPost } from "@/types/TwitterData";
import { ChartObject, TwitterChartData } from "@/types/Charts";
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
    prevChartsData: TwitterChartData;
}) => {
    const dbDate = formatToDatabaseDate(new Date());
    const obj = {
        likes: {
            date: dbDate,
            value: metricTotals.totalLikes
        },
        retweets: {
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

    if (metricTotals.prevChartsData) {
        const updatedChartData: TwitterChartData = {
            likes: [...metricTotals.prevChartsData.likes, obj.likes],
            replies: [...metricTotals.prevChartsData.replies, obj.replies],
            retweets: [...metricTotals.prevChartsData.retweets, obj.retweets],
            engagements: [...metricTotals.prevChartsData.engagements, obj.engagements],
            impressions: [...metricTotals.prevChartsData.impressions, obj.impressions],
            bookmarks: [...metricTotals.prevChartsData.bookmarks, obj.bookmarks],
            followers: [...metricTotals.prevChartsData.followers, obj.followers]
        };
    
        return updatedChartData;
    }

    const updatedData: TwitterChartData = {
        likes: [obj.likes],
        replies: [obj.replies],
        retweets: [obj.retweets],
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
