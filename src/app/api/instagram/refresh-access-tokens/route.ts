import dbConnect from "@/database/dbConnect";
import InstagramDataModel from "@/models/InstagramData";
import axios from "axios";

// The long live access token is valid for a total of 60 days post which the api will give error and also when called less than 24 hours from access token generation.

// to be called every 30 days (information for making a cron job)

export async function GET(_request: Request) {
    await dbConnect();

    try {
        const allUsers = await InstagramDataModel.find({});

        if (allUsers?.length > 0) {
            for (const user of allUsers) {
                if (user.userEmail === "dummy@example.com") {
                    continue;
                }

                if (user.accessCumRefreshToken) {
                    const params = {
                        grant_type: 'ig_refresh_token',
                        access_token: user.accessCumRefreshToken
                    }

                    try {
                        const response = await axios.get(`https://graph.instagram.com/refresh_access_token`, { params });
    
                        const expirationTime = new Date(Date.now() + response.data.expires_in * 1000);
            
                        const results = await InstagramDataModel.updateOne({ userEmail: user.userEmail }, {
                            $set: {
                                accessCumRefreshToken: response.data.access_token,
                                tokenExpiry: expirationTime
                            }
                        });
                        
                    } catch (err: any) {
                        console.log(err?.message);
                        console.log(err?.response?.data);
                        console.log("Error for user: ", user.userEmail)
                        console.error("Error refreshing token for Instagram user: ", err);
                    }
                }
        
            }
        }

        return Response.json({
            success: true,
            message: "All Instagram access tokens refreshed successfully"
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error refreshing tokens for Instagram: ", error);
        return Response.json({
            success: false,
            message: "Error updating Instagram access tokens"
        }, { status: 500 });
    }
}
