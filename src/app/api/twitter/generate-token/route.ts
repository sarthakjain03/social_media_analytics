import { authClient } from "@/actions/twitterAuth";
import UserModel from "@/models/User";
import TwitterDataModel from "@/models/TwitterData";
import dbConnect from "@/database/dbConnect";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { code, email } = await request.json();

        const tokenInfo = await authClient.requestAccessToken(code);

        const newTwitterData = new TwitterDataModel({
            userEmail: email,
            lastUpdated: null,
            accessToken: tokenInfo.token.access_token,
            refreshToken: tokenInfo.token.refresh_token,
            tokenExpiry: tokenInfo.token.expires_at,
            data: null
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

