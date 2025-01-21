import { AllTabCardsData, ChartData, ChartObject } from "@/types/Charts";

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
    linkedin: ChartData | null;
    instagram: ChartData | null;
    prevCardsData: AllTabCardsData | null;
}): AllTabCardsData => {
    const { twitter, linkedin, instagram, prevCardsData } = data;
    
    const followersArr: Array<Array<ChartObject>> = [];
    const likesArr: Array<Array<ChartObject>> = [];
    const impressionsArr: Array<Array<ChartObject>> = [];

    if (twitter) {
        followersArr.push(twitter.followers);
        likesArr.push(twitter.likes);
        impressionsArr.push(twitter.impressions);
    }
    if (linkedin) {
        followersArr.push(linkedin.followers);
        likesArr.push(linkedin.likes);
        impressionsArr.push(linkedin.impressions);
    }
    if (instagram) {
        followersArr.push(instagram.followers);
        likesArr.push(instagram.likes);
        impressionsArr.push(instagram.impressions);
    }

    const totalFollowers = getFollowerTotal(followersArr);
    const totalLikes = getOtherTotal(likesArr);
    const totalImpressions = getOtherTotal(impressionsArr);

    let newComparisonDate = new Date();
    let followersPercentChange = 0.00, likesPercentChange = 0.00, impressionsPercentChange = 0.00;

    if (prevCardsData) {
        const { followers, likes, impressions, retrievalDate } = prevCardsData;
        newComparisonDate = retrievalDate;
        const followersChange = totalFollowers - followers.value;
        const likesChange = totalLikes - likes.value;
        const impressionsChange = totalImpressions - impressions.value;
        followersPercentChange = Number(((followersChange / followers.value) * 100).toFixed(2));
        likesPercentChange = Number(((likesChange / likes.value) * 100).toFixed(2));
        impressionsPercentChange = Number(((impressionsChange / impressions.value) * 100).toFixed(2));
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
    };
};
