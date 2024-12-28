import dbConnect from "@/database/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { resetToken, newPassword } = await request.json();
        const foundEmailWithToken = await UserModel.findOne({ resetToken });

        if (!foundEmailWithToken) {
            return Response.json({
                success: false,
                message: "Invalid Link"
            }, { status: 404 });

        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const results = await UserModel.updateOne({ email: foundEmailWithToken.email }, {
            $set: { resetToken: null, resetTokenExpiry: null, password: hashedNewPassword }
        });

        return Response.json({
            success: true,
            message: "Password reset successfull"
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error resetting password", error);
        return Response.json(
            {
                success: false,
                message: "Something went wrong on our end. Please try again later"
            },
            { status: 500 }
        )
    }
}

