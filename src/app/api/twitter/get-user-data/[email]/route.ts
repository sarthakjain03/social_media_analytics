import dbConnect from "@/database/dbConnect";
import TwitterDataModel from "@/models/TwitterData";
import axios from "axios";

export async function GET(_request: Request, { params } : { params: { email: string } }) {
    await dbConnect();

    try {
        const email = params.email;

        const userData = await TwitterDataModel.findOne({ userEmail: email });
        if (!userData) {
            return Response.json({
                success: false,
                message: "User has not connected their X account"
            }, { status: 404 });
        }

        let refreshResponse;

        if (Number(userData.tokenExpiry) - Date.now() <= 300000) { // 5 minutes gap
            // refresh the user's access token for X account
            try {
                const response = await axios.post(`https://api.x.com/2/oauth2/token`, {
                    refresh_token: userData.refreshToken,
                    grant_type: "refresh_token",
                    client_id: process.env.TWITTER_CLIENT_ID as string
                }, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                refreshResponse = response.data;
                console.log(response.data);
                
            } catch (err) {
                console.error("Error refreshing token for X: ", err);
                return Response.json({
                    success: false,
                    message: "Failed to refresh access token for user's X account"
                }, { status: 500 });
            }
        }

        // TODO: check if lastUpdated is atleast 15 mins old then only get the user data using the access token as api call limit is 1 request per 15 mins. Update the user's twitter data with the new access token and expiry and other data.

        return Response.json({
            success: true,
            message: "Data retrieval from X successfull",
            refreshResponse,
            data: {}
        }, { status: 200 });
        
    } catch (error) {
        console.log("Error getting data from X: ", error);
        return Response.json({
            success: false,
            message: "Error getting data from X"
        }, { status: 500 });
    }
}

