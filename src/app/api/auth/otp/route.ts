import dbConnect from "@/database/dbConnect";
import OtpModel from "@/models/Otp";
import UserModel from "@/models/User";
import sendEmail from "@/actions/sendEmails";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email } = await request.json();
        
        const emailAlreadyRegistered = await UserModel.findOne({ email });
        if (emailAlreadyRegistered) {
            return Response.json({
                success: false,
                message: "Email address already registered"
            }, { status: 400 });
        }

        const otpAlreadyGenerated = await OtpModel.findOne({ email });
        if (otpAlreadyGenerated) {
            return Response.json({
                success: true,
                message: "OTP has been sent to the given email address already"
            }, { status: 200 });
        }

        const otp = Math.floor(100000 + Math.random()*900000);

        const otpForNewUser = new OtpModel({ email, otp });
        await otpForNewUser.save();

        await sendEmail({ email, otp, type: 'OTP' });

        return Response.json({
            success: true,
            message: `OTP sent successfully to ${email}`
        }, { status: 201 });

    } catch (error) {
        console.error("Error in sending OTP to the given email", error);
        return Response.json(
            {
                success: false,
                message: "Something went wrong on our end. Please try again later"
            },
            { status: 500 }
        )
    }
}

