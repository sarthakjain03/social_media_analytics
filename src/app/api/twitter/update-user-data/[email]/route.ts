import dbConnect from "@/database/dbConnect";
import ChartsDataModel from "@/models/ChartsData";
import TwitterDataModel from "@/models/TwitterData";
import { formatChartData, formatUserData, getMetricTotals } from "@/utils/formatXData";
import { Client } from "twitter-api-sdk";

// I think below twitter apis only return metrics for posts not older than 30 days.
// Will know on 31st Jan depending on my 2025 goals post is returned or not which was posted on 31st Dec. (gap of 30 days)

export async function GET(_request: Request, { params }: { params: Promise<{ email: string }> }) {
    await dbConnect();

    try {
        const email = (await params).email;

        const userData = await TwitterDataModel.findOne({ userEmail: email });
        if (!userData) {
            return Response.json({
                success: false,
                message: "User has not connected their X account"
            }, { status: 404 });
        }

        const prevChartsData = await ChartsDataModel.findOne({ userEmail: email });
        if (!prevChartsData) {
            return Response.json({
                success: false,
                message: "User charts data not found"
            }, { status: 404 });
        }

        const refreshResponse = {
            access_token: userData.accessToken,
            refresh_token: userData.refreshToken,
            expires_at: userData.tokenExpiry,
            last_update: userData.lastUpdated
        };

        if (Date.now() - Number(userData.lastUpdated) > 86400000) { // min 24 hrs gap between api calls
            // getting user data and tweets from X.
            const twitterClient = new Client(refreshResponse.access_token);
            const user = await twitterClient.users.findMyUser({
                "user.fields": ["id", "public_metrics", "username", "name"]
            });
            
            if (user?.errors && Array.isArray(user.errors)) {
                let statusCode = 400;
                const messages = user.errors.map((err) => {
                    if (err.status) statusCode = err.status;
                    return err.detail;
                });
                return Response.json({
                    success: false,
                    message: messages.join(", ")
                }, { status: statusCode });
            }
            
            let posts = null;
            const post_ids = [...userData.post_ids];
            
            if (user?.data?.id) {
                const params: any = {
                    "max_results": 10,
                    "tweet.fields": [
                        //"created_at",
                        "id",
                        //"non_public_metrics",
                        //"public_metrics",
                        //"text"
                    ]
                }
                
                if (userData.post_ids?.length > 0) {
                    params.since_id = userData.post_ids[userData.post_ids.length - 1];
                }
                
                const res = await twitterClient.tweets.usersIdTweets(user.data.id, params);
                if (res?.errors && Array.isArray(res.errors)) {
                    let statusCode = 400;
                    const messages = res.errors.map((err) => {
                        if (err.status) statusCode = err.status;
                        return err.detail;
                    });
                    return Response.json({
                        success: false,
                        message: messages.join(", ")
                    }, { status: statusCode });
                }
                
                posts = res;
            }
    
            if (posts?.data) {
                posts.data.map((post) => {
                    if (!post_ids.includes(post.id)) {
                        post_ids.push(post.id);
                    }
                });
            }
    
            const tweets = await twitterClient.tweets.findTweetsById({
                "ids": post_ids,
                "tweet.fields": [
                    "id",
                    "non_public_metrics",
                    "public_metrics"
                ]
            });

            if (tweets?.errors && Array.isArray(tweets.errors)) {
                let statusCode = 400;
                const messages = tweets.errors.map((err) => {
                    if (err.status) statusCode = err.status;
                    return err.detail;
                });
                return Response.json({
                    success: false,
                    message: messages.join(", ")
                }, { status: statusCode });
            }

            const formattedUserData = formatUserData(user.data);
            const metricTotals = getMetricTotals(tweets?.data);
            const updatedChartsData = formatChartData({ ...metricTotals, totalFollowers: formattedUserData?.followers, prevChartsData: prevChartsData.twitterData });

            const results = await TwitterDataModel.updateOne({ userEmail: email }, {
                $set: {
                    userData: formattedUserData,
                    post_ids: post_ids,
                    //chartsData: updatedChartsData,
                    lastUpdated: Date.now()
                }
            });

            const chartsResults = await ChartsDataModel.updateOne({ userEmail: email }, {
                $set: {
                    twitterData: updatedChartsData
                }
            });

            return Response.json({
                success: true,
                message: "X Analytics updated successfully",
                data: {
                    lastUpdate: Date.now()
                }
            }, { status: 200 });
        }

        return Response.json({
            success: false,
            message: "Data will be updated only once a day",
            data: {
                lastUpdate: refreshResponse.last_update
            }
        }, { status: 429 });
        
    } catch (error: any) {
        console.log(error?.message);
        console.log(error?.response?.data);
        console.error("Error getting data from X: ", error);
        return Response.json({
            success: false,
            message: "Error updating user's X data"
        }, { status: 500 });
    }
}
