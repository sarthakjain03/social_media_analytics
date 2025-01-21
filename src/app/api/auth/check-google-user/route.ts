import dbConnect from "@/database/dbConnect";
import ChartsDataModel from "@/models/ChartsData";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { name, email } = await request.json();

        const userRegistered = await UserModel.findOne({ email });
        if (!userRegistered) {
            // If Google user is not registered in database then add the user with a default password
            const defaultPassword = process.env.DEFAULT_PASSWORD_FOR_GOOGLE_USERS as string;
            const hashedDefaultPassword = await bcrypt.hash(defaultPassword, 10);

            const newUser = new UserModel({
                name,
                email,
                password: hashedDefaultPassword
            });
            newUser.save();

            const newChartsData = new ChartsDataModel({ 
                userEmail: email,
                cardsData: null,
                twitterData: null,
                instagramData: null,
                linkedinData: null
            });
            newChartsData.save();

            return Response.json({
                success: true,
                message: "User registered",
                data: { name, email }
            }, { status: 200 });
        }

        return Response.json({
            success: true,
            message: "User data retrieved from db successfully",
            data: {
                name,
                email,
                isXConnected: userRegistered.isXConnected,
                isLinkedinConnected: userRegistered.isLinkedinConnected,
                isInstagramConnected: userRegistered.isInstagramConnected
            }
        }, { status: 200 });

        
    } catch (error) {
        console.error("Error checking google user in database", error);
        return Response.json(
            {
                success: false,
                message: "Something went wrong on our end. Please try again later"
            },
            { status: 500 }
        )
    }
}

