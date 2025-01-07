import dbConnect from "@/database/dbConnect";
import TwitterDataModel from "@/models/TwitterData";
import { formatChartData, formatUserData, getMetricTotals } from "@/utils/formatXData";
import axios from "axios";
import { Client } from "twitter-api-sdk";

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

        let refreshResponse = {
            access_token: userData.accessToken,
            refresh_token: userData.refreshToken,
            expires_at: userData.tokenExpiry,
            last_updated: Number(userData.lastUpdated)
        };

        // refresh the user's access token for X account if <= 2 mins left for expiration.
        if (Number(userData.tokenExpiry) - Date.now() <= 120000) { // 2 minutes gap
            const clientID = process.env.TWITTER_CLIENT_ID as string;
            const clientSecret = process.env.TWITTER_CLIENT_SECRET as string;
            const encoded = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');
            try {
                const response = await axios.post(`https://api.x.com/2/oauth2/token`, {
                    refresh_token: userData.refreshToken,
                    grant_type: "refresh_token",
                    client_id: clientID
                }, {
                    headers: {
                        'Authorization': `Basic ${encoded}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                refreshResponse = {...response.data, last_updated: Number(userData.lastUpdated)};
                
            } catch (err) {
                console.error("Error refreshing token for X: ", err);
                return Response.json({
                    success: false,
                    message: "Failed to refresh access token for user's X account",
                    data: {
                        lastUpdate: refreshResponse.last_updated
                    }
                }, { status: 500 });
            }
        }

        if (Date.now() - Number(userData.lastUpdated) > 900000) { // min 15 minutes gap between api calls
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
                    message: messages.join(", "),
                    data: {
                        lastUpdate: refreshResponse.last_updated
                    }
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
    
                // TODO: first get new posts data then update old posts data.
    
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
                        message: messages.join(", "),
                        data: {
                            lastUpdate: refreshResponse.last_updated
                        }
                    }, { status: statusCode });
                }
    
                posts = res;
            }
    
            if (posts?.data) {
                posts.data.map((post) => {
                    post_ids.push(post.id);
                });
            }
    
            const tweets = await twitterClient.tweets.findTweetsById({
                "ids": [...post_ids],
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
                    message: messages.join(", "),
                    data: {
                        lastUpdate: refreshResponse.last_updated
                    }
                }, { status: statusCode });
            }

            const formattedUserData = formatUserData(user.data);
            const metricTotals = getMetricTotals(tweets?.data);
            const updatedChartsData = formatChartData({ ...metricTotals, prevChartsData: userData.chartsData });

            const results = await TwitterDataModel.updateOne({ userEmail: email }, {
                $set: {
                    accessToken: refreshResponse.access_token,
                    refreshToken: refreshResponse.refresh_token,
                    tokenExpiry: refreshResponse.expires_at,
                    userData: formattedUserData,
                    post_ids: post_ids,
                    chartsData: updatedChartsData,
                    lastUpdated: Date.now()
                }
            });

            return Response.json({
                success: true,
                message: "User data updated successfully",
                data: {
                    lastUpdate: Date.now()
                }
            }, { status: 200 });
        }

        return Response.json({
            success: false,
            message: "Data will be updated in a few minutes",
            data: {
                lastUpdate: refreshResponse.last_updated
            }
        }, { status: 429 });
        
    } catch (error) {
        console.error("Error getting data from X: ", error);
        return Response.json({
            success: false,
            message: "Error updating user's X data"
        }, { status: 500 });
    }
}
