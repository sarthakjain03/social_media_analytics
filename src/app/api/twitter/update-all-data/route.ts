import dbConnect from "@/database/dbConnect";
import ChartsDataModel from "@/models/ChartsData";
import TwitterDataModel from "@/models/TwitterData";
import { formatChartData, formatUserData, getMetricTotals } from "@/utils/formatXData";
import { Client } from "twitter-api-sdk";

export async function GET(_request: Request) {
    await dbConnect();

    try {
        const allUsers = await TwitterDataModel.find(); // Fetch all users

        if (!allUsers || allUsers.length === 0) {
            return Response.json({
                success: false,
                message: "No users found to update"
            }, { status: 404 });
        }

        for (const userData of allUsers) {
            const email = userData.userEmail;

            if (email === "dummy@example.com") { // Skip dummy user
                continue;
            }

            const prevChartsData = await ChartsDataModel.findOne({ userEmail: email });

            if (!prevChartsData) {
                console.log(`No charts data found for user: ${email}`);
                continue;
            }

            const refreshResponse = {
                access_token: userData.accessToken,
                refresh_token: userData.refreshToken,
                expires_at: userData.tokenExpiry,
                last_update: userData.lastUpdated
            };

            if (Date.now() - Number(userData.lastUpdated) > 86400000) { // Min 24 hrs gap between API calls
                const twitterClient = new Client(refreshResponse.access_token);
                const user = await twitterClient.users.findMyUser({
                    "user.fields": ["id", "public_metrics", "username", "name"]
                });

                if (user?.errors && Array.isArray(user.errors)) {
                    console.error(`Errors for user: ${email}`, user.errors);
                    continue;
                }

                let posts = null;
                const storedPosts = [...userData.posts];
                const post_ids: string[] = [];

                const now = new Date();
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(now.getDate() - 30);
                for (let i = 0; i < storedPosts.length; i++) {
                    if (storedPosts[i].createdAt > thirtyDaysAgo) {
                        post_ids.push(storedPosts[i].id)
                    } else {
                        storedPosts.splice(i, 1)
                    }
                }

                if (user?.data?.id) {
                    const params: any = {
                        "max_results": 10,
                        "tweet.fields": ["id", "created_at"]
                    };

                    if (post_ids?.length > 0) {
                        params.since_id = post_ids[post_ids.length - 1];
                    }

                    const res = await twitterClient.tweets.usersIdTweets(user.data.id, params);

                    if (res?.errors && Array.isArray(res.errors)) {
                        console.error(`Errors fetching tweets for user: ${email}`, res.errors);
                        continue;
                    }

                    posts = res;
                }

                if (posts?.data) {
                    posts.data.forEach((post) => {
                        if (!post_ids.includes(post.id)) {
                            post_ids.push(post.id);
                            if (post.created_at) {
                                const isOld = new Date(post.created_at) <= thirtyDaysAgo
                                if (!isOld) {
                                    storedPosts.push({ id: post.id, createdAt: new Date(post.created_at) })
                                } 
                            }
                        }
                    });
                    if (post_ids.length > 100) {
                        const excessLength = post_ids.length - 100;
                        post_ids.splice(0, excessLength);
                    }
                }

                const tweets = await twitterClient.tweets.findTweetsById({
                    "ids": post_ids, // Max of 100 ids only
                    "tweet.fields": ["id", "non_public_metrics", "public_metrics"]
                });
                // posts older than 30 days will give error in the above api call

                if (tweets?.errors && Array.isArray(tweets.errors)) {
                    console.error(`Errors fetching tweet metrics for user: ${email}`, tweets.errors);
                    continue;
                }

                const formattedUserData = formatUserData(user.data);
                const metricTotals = getMetricTotals(tweets?.data);
                const updatedChartsData = formatChartData({
                    ...metricTotals,
                    totalFollowers: formattedUserData?.followers,
                    prevChartsData: prevChartsData.twitterData
                });

                await TwitterDataModel.updateOne({ userEmail: email }, {
                    $set: {
                        userData: formattedUserData,
                        posts: storedPosts,
                        lastUpdated: Date.now()
                    }
                });

                await ChartsDataModel.updateOne({ userEmail: email }, {
                    $set: {
                        twitterData: updatedChartsData
                    }
                });

                console.log(`Successfully updated data for user: ${email}`);
            } else {
                console.log(`User: ${email} was updated less than 24 hours ago`);
            }

            // Delay of 15.1 minutes (906,000 milliseconds) before updating the next user
            //console.log(`Waiting 15.1 minutes before processing the next user...`);
            //await delay(906000);
        }

        return Response.json({
            success: true,
            message: "All users' data updated successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating all users' data: ", error);
        return Response.json({
            success: false,
            message: "Error updating all users' data"
        }, { status: 500 });
    }
}
