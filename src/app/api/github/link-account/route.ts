import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/database/dbConnect";
import GithubDataModel from "@/models/GithubData";
import UserModel from "@/models/User";
import ChartsDataModel from "@/models/ChartsData";
import { Octokit } from "@octokit/rest"; // Import Octokit
import { formatGithubChartData } from "@/utils/formatGithubData"; // Import formatter

const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN }); // Initialize Octokit

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 });
    }

    try {
        const { username } = await request.json();

        // Create GitHub user record
        const githubUser = new GithubDataModel({
            userEmail: session.user.email,
            username,
            userData: null,
            lastUpdated: null
        });
        await githubUser.save();

        // Update user's GitHub connection status
        await UserModel.findOneAndUpdate(
            { email: session.user.email },
            { isGithubConnected: true }
        );

        // Fetch and update GitHub data
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
            commits: events
                .filter((e) => e.type === "PushEvent" && Array.isArray((e.payload as any).commits))
                .reduce((c, e) => c + ((e.payload as any).commits?.length || 0), 0),
            issues: events.filter((e) => e.type === "IssuesEvent").length,
            pullRequests: events.filter((e) => e.type === "PullRequestEvent").length,
            reviews: events.filter((e) => e.type === "PullRequestReviewEvent").length,
            reposCreated: events.filter(
                (e) => e.type === "CreateEvent" && (e.payload as any)?.ref_type === "repository"
            ).length,
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
            prevChartsData: null,
            userData: formattedUserData,
        });

        await GithubDataModel.updateOne(
            { userEmail: session.user.email },
            {
                $set: {
                    userData: formattedUserData,
                    lastUpdated: Date.now(),
                },
            }
        );

        await ChartsDataModel.findOneAndUpdate(
            { userEmail: session.user.email },
            {
                $set: {
                    githubData: updatedChartsData,
                },
            }
        );

        return NextResponse.json({
            success: true,
            message: "GitHub account linked and data updated successfully"
        });

    } catch (error: any) {
        const message = error.code === 11000 
            ? "This email is already linked to a GitHub account" 
            : error.message || "Something went wrong";
            
        return NextResponse.json({
            success: false,
            message
        }, { status: 500 });
    }
}
