import dbConnect from "@/database/dbConnect";
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
            const hashedDefaultPassword = bcrypt.hash(defaultPassword, 10);

            const newUser = new UserModel({
                name,
                email,
                password: hashedDefaultPassword
            });
            newUser.save();
        }

        return Response.json({
            success: true,
            message: "User registered"
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

