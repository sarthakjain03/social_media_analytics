export interface GithubUserData {
    followers: string;
    following: string;
    stars: string;
    repos:string;
    contributions: string;
    contributionsBreakdown?: {
        commits: number;
        issues: number;
        pullRequests: number;
        reviews: number;
        reposCreated: number;
      };
}
