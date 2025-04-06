import dbConnect from "@/database/dbConnect";
import ChartsDataModel from "@/models/ChartsData";
import GithubDataModel from "@/models/GithubData";
import { Octokit } from "@octokit/rest";
import { formatGithubChartData } from "@/utils/formatGithubData";

const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });

export async function GET(_request: Request) {
  await dbConnect();

  try {
    const allUsers = await GithubDataModel.find();

    if (!allUsers || allUsers.length === 0) {
      return Response.json({
        success: false,
        message: "No users found to update",
      }, { status: 404 });
    }

    for (const userData of allUsers) {
      const email = userData.userEmail;
      const username = userData.username;

      if (email === "dummy@example.com") continue;

      const prevChartsData = await ChartsDataModel.findOne({ userEmail: email });
      if (!prevChartsData) {
        console.log(`No charts data found for user: ${email}`);
        continue;
      }

      if (Date.now() - Number(userData.lastUpdated) > 86400000) {
        try {
          const [userRes, reposRes, eventsRes] = await Promise.all([
            octokit.users.getByUsername({ username }),
            octokit.repos.listForUser({ username, per_page: 100 }),
            octokit.activity.listPublicEventsForUser({ username, per_page: 100 }),
          ]);

          const user = userRes.data;
          const repos = reposRes.data;
          const events = eventsRes.data;

          const stars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
          const contributionsBreakdown = {
            commits: events.filter(e => e.type === "PushEvent").reduce((c, e) => c + ((e.payload as any).commits?.length || 0), 0),
            issues: events.filter(e => e.type === "IssuesEvent").length,
            pullRequests: events.filter(e => e.type === "PullRequestEvent").length,
            reviews: events.filter(e => e.type === "PullRequestReviewEvent").length,
            reposCreated: events.filter(e => e.type === "CreateEvent" && (e.payload as any)?.ref_type === "repository").length,
          };

          const formattedUserData = {
            followers: user.followers.toString(),
            following: user.following.toString(),
            stars: stars.toString(),
            repos: repos.length.toString(),
            contributions: (
              contributionsBreakdown.commits +
              contributionsBreakdown.issues +
              contributionsBreakdown.pullRequests +
              contributionsBreakdown.reviews +
              contributionsBreakdown.reposCreated
            ).toString(),
            contributionsBreakdown,
          };

          const updatedChartsData = formatGithubChartData({
            prevChartsData: prevChartsData.githubData,
            userData: formattedUserData,
          });

          await GithubDataModel.updateOne({ userEmail: email }, {
            $set: {
              userData: formattedUserData,
              lastUpdated: Date.now(),
            },
          });

          await ChartsDataModel.updateOne({ userEmail: email }, {
            $set: {
              githubData: updatedChartsData,
            },
          });

          console.log(`Successfully updated data for user: ${email}`);
        } catch (err) {
          console.error(`Error fetching data for user: ${email}`, err);
        }
      } else {
        console.log(`User: ${email} was updated less than 24 hours ago`);
      }
    }

    return Response.json({
      success: true,
      message: "All users' data updated successfully",
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating all users' data: ", error);
    return Response.json({
      success: false,
      message: "Error updating all users' data",
    }, { status: 500 });
  }
}
