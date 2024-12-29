import dbConnect from "@/database/dbConnect";
import UserModel from "@/models/User";
import crypto from "crypto";
import sendEmail from "@/actions/sendEmails";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email } = await request.json();
        const isEmailRegistered = await UserModel.findOne({ email });

        if (!isEmailRegistered) {
            return Response.json({
                success: false,
                message: "Email address is not registered"
            }, { status: 404 });
        } else if (isEmailRegistered.resetTokenExpiry) {
            if (Number(isEmailRegistered.resetTokenExpiry) > Date.now()) {
                return Response.json({
                    success: true,
                    message: "Reset link has already been sent"
                }, { status: 200 });
            }
        }

        const newResetToken = crypto.randomBytes(20).toString("hex");
        const newResetTokenExpiry = new Date(Date.now() + 1800000); // 30 minutes expiry

        const results = await UserModel.updateOne({ email }, {
            $set: { resetToken: newResetToken, resetTokenExpiry: newResetTokenExpiry }
        });

        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${newResetToken}`;
        
        await sendEmail({ email, forgotPasswordUrl: resetUrl, type: 'RESET' });

        return Response.json({
            success: true,
            message: "Reset link sent successfully"
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error sending reset password link", error);
        return Response.json(
            {
                success: false,
                message: "Something went wrong on our end. Please try again later"
            },
            { status: 500 }
        )
    }
}

