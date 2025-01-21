export interface ChartObject {
  date: string;
  value: number;
}

export interface ChartSeriesObject {
  name: string;
  data: number[];
}

export interface ChartData {
  likes: Array<ChartObject>;
  impressions: Array<ChartObject>;
  reposts: Array<ChartObject>;
  replies: Array<ChartObject>;
  engagements: Array<ChartObject>;
  bookmarks: Array<ChartObject>;
  followers: Array<ChartObject>;
}

interface CardData {
  title: string;
  value: number;
  percentChange: number;
}

export interface AllTabCardsData {
  comparisonDate: Date;
  retrievalDate: Date;
  followers: CardData;
  likes: CardData;
  impressions: CardData;
}

export interface AllChartsData {
  likes: Array<ChartSeriesObject>;
  replies: Array<ChartSeriesObject>;
  bookmarks: Array<ChartSeriesObject>;
  reposts: Array<ChartSeriesObject>;
  followers: Array<ChartSeriesObject>;
  impressions: Array<ChartSeriesObject>;
}
