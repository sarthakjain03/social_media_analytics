export interface ChartObject {
    date: string;
    value: number;
}

export interface ChartSeriesObject {
    name: string;
    data: number[];
}

export interface TwitterChartData {
    likes: Array<ChartObject>;
    impressions: Array<ChartObject>;
    retweets: Array<ChartObject>;
    replies: Array<ChartObject>;
    engagements: Array<ChartObject>;
    bookmarks: Array<ChartObject>;
    followers: Array<ChartObject>;
}
