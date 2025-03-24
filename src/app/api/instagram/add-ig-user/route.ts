import dbConnect from "@/database/dbConnect";
import InstagramDataModel from "@/models/InstagramData";
import UserModel from "@/models/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email, accessToken, expiresIn } = await request.json()

        if (email && accessToken && expiresIn) {
            const updateIGUser = new InstagramDataModel({
                userEmail: email,
                accessCumRefreshToken: accessToken,
                tokenExpiry: expiresIn,
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
            message: "Invalid Payload"
        }, { status: 400 });
        
    } catch (error) {
        console.error("Error adding Instagram user: ", error);
        return Response.json({
            success: false,
            message: "Error adding Instagram user"
        }, { status: 500 });
    }
}