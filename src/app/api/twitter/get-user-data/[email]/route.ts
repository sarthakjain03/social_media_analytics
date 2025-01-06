import dbConnect from "@/database/dbConnect";
import TwitterDataModel from "@/models/TwitterData";
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

        if (Number(userData.tokenExpiry) - Date.now() <= 120000) { // 2 minutes gap
            // refresh the user's access token for X account
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

        if (Date.now() - Number(userData.lastUpdated) >= 900000) { // 15 minutes gap
            // getting user data and tweets from X.
            const twitterClient = new Client(refreshResponse.access_token);
            try {
                const user = await twitterClient.users.findMyUser({
                    "user.fields": ["id", "public_metrics", "username", "name"]
                });

                let tweets = null;

                if (user?.data?.id) {
                    const res = await twitterClient.tweets.usersIdTweets(user.data.id, {
                        // "since_id": "",
                        "start_time": new Date("2024-12-24").toISOString(), // since_id takes priority
                        "tweet.fields": [
                            //"author_id",
                            "context_annotations",
                            "id",
                            "non_public_metrics",
                            "public_metrics",
                            "text"
                        ],
                        "media.fields": [
                            "non_public_metrics",
                            "public_metrics",
                            "type"
                        ]
                    });

                    tweets = res;
                }

                refreshResponse.last_updated = Date.now();

                const results = await TwitterDataModel.updateOne({ userEmail: email }, {
                    $set: {
                        accessToken: refreshResponse.access_token,
                        refreshToken: refreshResponse.refresh_token,
                        tokenExpiry: refreshResponse.expires_at,
                        lastUpdated: refreshResponse.last_updated,
                        data: {
                            userData: user?.data ?? null,
                            tweetsData: tweets
                        }
                    }
                });

                return Response.json({
                    success: true,
                    message: "Data retrieval from X successfull",
                    data: {
                        lastUpdate: refreshResponse.last_updated
                    }
                }, { status: 200 });
                
            } catch (err) {
                console.error("Error retrieving user data from X using access token: ", err);
                return Response.json({
                    success: false,
                    message: "Error retrieving user data from X using access token",
                    data: {
                        lastUpdate: refreshResponse.last_updated
                    }
                }, { status: 401 });
            }
        }

        return Response.json({
            success: false,
            message: "Not enough time has passed to retrieve the data from X again",
            data: {
                lastUpdate: refreshResponse.last_updated
            }
        }, { status: 429 });
        
    } catch (error) {
        console.error("Error getting data from X: ", error);
        return Response.json({
            success: false,
            message: "Error getting data from X"
        }, { status: 500 });
    }
}

