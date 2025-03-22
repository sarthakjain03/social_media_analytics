import { authClient } from "@/actions/twitterAuth";
import UserModel from "@/models/User";
import TwitterDataModel from "@/models/TwitterData";
import dbConnect from "@/database/dbConnect";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { state, code, email } = await request.json();
        const originalState = process.env.TWITTER_AUTH_STATE as string;
        if (state !== originalState) { // TODO: secure state somehow using bcrypt or something
            return Response.json({
                success: false,
                message: "Invalid state for X token generation"
            }, { status: 400 });
        }
        
        // console.log("Before X authclient line")
        // console.log(code as string)
        const tokenInfo = await authClient.requestAccessToken(code as string);
        // console.log(tokenInfo)
        
        const newTwitterData = new TwitterDataModel({
            userEmail: email,
            lastUpdated: null,
            accessToken: tokenInfo.token.access_token,
            refreshToken: tokenInfo.token.refresh_token,
            tokenExpiry: tokenInfo.token.expires_at
        });
        await newTwitterData.save();
        
        const update = await UserModel.updateOne({ email }, {
            $set: { isXConnected: true }
        });

        return Response.json({
            success: true,
            message: "Token generated successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error generating access token for X: ", error);
        return Response.json({
            success: false,
            message: "Error generating access token for X"
        }, { status: 500 });
    }
}

