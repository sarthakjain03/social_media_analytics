import dbConnect from "@/database/dbConnect";
import TwitterDataModel from "@/models/TwitterData";
import axios from "axios";

// This api is for refreshing both the access token and refresh tokens as the currently twitter refresh token is valid till the access token is valid which is about 2 hrs only.

export async function GET(_request: Request) {
    await dbConnect();

    try {
        const allUsers = await TwitterDataModel.find({});

        const clientID = process.env.TWITTER_CLIENT_ID as string;
        const clientSecret = process.env.TWITTER_CLIENT_SECRET as string;
        const encoded = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');

        const responseTokenExpirations: any[] = [];

        if (allUsers?.length > 0) {
            allUsers.forEach(async (user) => {
                const params = new URLSearchParams();
                params.append('refresh_token', user.refreshToken);
                params.append('grant_type', 'refresh_token');
                params.append('client_id', clientID);

                console.log("Inside allUsers forEach, params: ", params);
        
                try {
                    const response = await axios.post(`https://api.x.com/2/oauth2/token`, params, {
                        headers: {
                            'Authorization': `Basic ${encoded}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });

                    console.log("Token refresh response: ", response);

                    responseTokenExpirations.push(response.data.expires_at);
        
                    const results = await TwitterDataModel.updateOne({ userEmail: user.userEmail }, {
                        $set: {
                            accessToken: response.data.access_token,
                            refreshToken: response.data.refresh_token,
                            tokenExpiry: response.data.expires_at
                        }
                    });
                    
                } catch (err: any) {
                    console.log(err?.message);
                    console.log(err?.response?.data);
                    console.error("Error refreshing token for X user: ", err);
                }
            })
        }

        return Response.json({
            success: true,
            message: "All access tokens refreshed successfully",
            data: {
                users: allUsers,
                tokenExpirations: responseTokenExpirations
            }
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error refreshing tokens for X: ", error);
        return Response.json({
            success: false,
            message: "Error updating X access tokens"
        }, { status: 500 });
    }
}
