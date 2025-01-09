export interface TwitterPost {
    post_id: string;
    text: string;
    likes: number;
    retweets: number;
    bookmarks: number;
    impressions: number;
    replies: number;
    engagements: number;
    userProfileClicks: number;
    createdAt: Date | string;
}

// might implement this feature later i.e. weekly most popular post of the user.
interface PopularityObject {
    post_id: string;
    popularity: number; // likes + retweets + replies + impressions + engagements = popularity
}

export interface TwitterUserData {
    followers: number;
    x_id: string;
}
