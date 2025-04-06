import { AllTabCardsData, ChartData, ChartObject, GithubChartData } from "@/types/Charts";

const getFollowerTotal = (followers: Array<Array<ChartObject>>): number => {
    let totalFollowers = 0;
    followers.forEach((follows) => {
        const len = follows.length;
        totalFollowers += follows[len - 1].value;
    });
    return totalFollowers;
};

const getOtherTotal = (data: Array<Array<ChartObject>>): number => {
    let totalLikes = 0;
    data.forEach((cardMetric) => {
        for (let i=0 ; i<cardMetric.length ; i++) {
            totalLikes += cardMetric[i].value;
        }
    });
    return totalLikes;
};

export const getFormattedCardsData = (data: {
    twitter: ChartData | null;
    github:  GithubChartData | null;
    instagram: ChartData | null;
    prevCardsData: AllTabCardsData | null;
}): AllTabCardsData => {
    const { twitter, github, instagram, prevCardsData } = data;
    
    const followersArr: Array<Array<ChartObject>> = [];
    const likesArr: Array<Array<ChartObject>> = [];
    const impressionsArr: Array<Array<ChartObject>> = [];
    const engagementsArr: Array<Array<ChartObject>> = [];
    const repliesArr: Array<Array<ChartObject>> = [];
    const bookmarksArr: Array<Array<ChartObject>> = [];

    if (twitter) {
        followersArr.push(twitter.followers);
        likesArr.push(twitter.likes);
        impressionsArr.push(twitter.impressions);
        engagementsArr.push(twitter.engagements);
        repliesArr.push(twitter.replies);
        bookmarksArr.push(twitter.bookmarks);
    }
    // if (github) {
    //     followersArr.push(github.followers);
    //     likesArr.push(github.likes);
    //     impressionsArr.push(github.impressions);
    // }
    if (instagram) {
        followersArr.push(instagram.followers);
        likesArr.push(instagram.likes);
        impressionsArr.push(instagram.impressions);
        engagementsArr.push(instagram.engagements);
        repliesArr.push(instagram.replies);
        bookmarksArr.push(instagram.bookmarks);
    }

    const totalFollowers = getFollowerTotal(followersArr);
    const totalLikes = getOtherTotal(likesArr);
    const totalImpressions = getOtherTotal(impressionsArr);
    const totalEngagements = getOtherTotal(engagementsArr);
    const totalReplies = getOtherTotal(repliesArr);
    const totalBookmarks = getOtherTotal(bookmarksArr);

    let newComparisonDate = new Date();
    let followersPercentChange = 0.0,
        likesPercentChange = 0.0,
        impressionsPercentChange = 0.0,
        engagementsPercentChange = 0.0,
        repliesPercentChange = 0.0,
        bookmarksPercentChange = 0.0;

    if (prevCardsData) {
        const {
            followers,
            likes,
            impressions,
            engagements,
            replies,
            bookmarks,
            retrievalDate,
        } = prevCardsData;

        newComparisonDate = retrievalDate;

        followersPercentChange = Number(
            (((totalFollowers - followers.value) / followers.value) * 100).toFixed(2)
        );
        likesPercentChange = Number(
            (((totalLikes - likes.value) / likes.value) * 100).toFixed(2)
        );
        impressionsPercentChange = Number(
            (((totalImpressions - impressions.value) / impressions.value) * 100).toFixed(2)
        );
        engagementsPercentChange = Number(
            (((totalEngagements - engagements.value) / engagements.value) * 100).toFixed(2)
        );
        repliesPercentChange = Number(
            (((totalReplies - replies.value) / replies.value) * 100).toFixed(2)
        );
        bookmarksPercentChange = Number(
            (((totalBookmarks - bookmarks.value) / bookmarks.value) * 100).toFixed(2)
        );
    }

    return {
        comparisonDate: newComparisonDate,
        retrievalDate: new Date(),
        followers: {
            title: "Followers",
            value: totalFollowers,
            percentChange: followersPercentChange,
        },
        likes: {
            title: "Likes",
            value: totalLikes,
            percentChange: likesPercentChange,
        },
        impressions: {
            title: "Impressions",
            value: totalImpressions,
            percentChange: impressionsPercentChange,
        },
        engagements: {
            title: "Engagements",
            value: totalEngagements,
            percentChange: engagementsPercentChange,
        },
        replies: {
            title: "Replies",
            value: totalReplies,
            percentChange: repliesPercentChange,
        },
        bookmarks: {
            title: "Bookmarks",
            value: totalBookmarks,
            percentChange: bookmarksPercentChange,
        },
    };
};
