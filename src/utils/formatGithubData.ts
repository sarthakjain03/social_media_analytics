import { GithubUserData } from "@/types/GithubData";
import { ChartObject, GithubChartData } from "@/types/Charts";
import { formatToDatabaseDate } from "./dateFormatters";

export const formatGithubUserData = (data: any): GithubUserData => {
  const {
    followers,
    following,
    stars,
    repos,
    contributions,
    contributionsBreakdown
  } = data;

  return {
    followers,
    following,
    stars,
    repos,
    contributions,
    contributionsBreakdown
  };
};

export const formatGithubChartData = (input: {
  userData: GithubUserData;
  prevChartsData: GithubChartData | null;
}): GithubChartData => {
  const { userData, prevChartsData } = input;
  const dbDate = formatToDatabaseDate(new Date());

  const obj: { [key: string]: ChartObject } = {
    followers: { date: dbDate, value: parseInt(userData.followers) },
    stars: { date: dbDate, value: parseInt(userData.stars) },
    contributions: { date: dbDate, value: parseInt(userData.contributions) },
    commits: {
      date: dbDate,
      value: userData.contributionsBreakdown?.commits || 0
    },
    pullRequests: {
      date: dbDate,
      value: userData.contributionsBreakdown?.pullRequests || 0
    },
    issues: {
      date: dbDate,
      value: userData.contributionsBreakdown?.issues || 0
    }
  };

  if (prevChartsData && Object.keys(prevChartsData).length > 0) {
    const updatedChartData: GithubChartData = {
      followers: [...prevChartsData.followers, obj.followers],
      stars: [...prevChartsData.stars, obj.stars],
      contributions: [...prevChartsData.contributions, obj.contributions],
      commits: [...prevChartsData.commits, obj.commits],
      pullRequests: [...prevChartsData.pullRequests, obj.pullRequests],
      issues: [...prevChartsData.issues, obj.issues]
    };
    return updatedChartData;
  }

  const updatedData: GithubChartData = {
    followers: [obj.followers],
    stars: [obj.stars],
    contributions: [obj.contributions],
    commits: [obj.commits],
    pullRequests: [obj.pullRequests],
    issues: [obj.issues]
  };

  return updatedData;
};
