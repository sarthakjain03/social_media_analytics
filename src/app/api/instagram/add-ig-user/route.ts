import dbConnect from "@/database/dbConnect";
import InstagramDataModel from "@/models/InstagramData";
import UserModel from "@/models/User";
import axios from "axios";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email, accessToken } = await request.json()

        const params = {
            grant_type: 'ig_exchange_token',
            client_secret: process.env.INSTAGRAM_APP_SECRET as string,
            access_token: accessToken
        };
        const accessTokenResponse = await axios.get('https://graph.instagram.com/access_token', { params })
        console.log("Long lived access token response: ", accessTokenResponse) // TODO: remove

        if (accessTokenResponse?.data?.access_token) {
            // valid for 60 days, can be refreshed only after 24 hours atleast if not expired
            const updateIGUser = new InstagramDataModel({
                userEmail: email,
                accessCumRefreshToken: accessTokenResponse?.data?.access_token,
                tokenExpiry: accessTokenResponse?.data?.expires_in,
                lastUpdated: null,
                userData: null
            })
            await updateIGUser.save()
            
            const updateUser = await UserModel.updateOne({ email }, {
                $set: { isInstagramConnected: true }
            })
    
            return Response.json({
                success: true,
                message: "Instagram user added successfully!"
            }, { status: 200 });
        }

        return Response.json({
            success: false,
            message: "Invalid Request"
        }, { status: 400 });
        
    } catch (error) {
        console.error("Error adding Instagram user: ", error);
        return Response.json({
            success: false,
            message: "Error adding Instagram user"
        }, { status: 500 });
    }
}