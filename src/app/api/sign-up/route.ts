import dbConnect from "@/database/dbConnect";
import OtpModel from "@/models/Otp";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { name, email, attemptedOtp, password } = await request.json();
        const otpExistsForEmail = await OtpModel.findOne({ email });

        if (!otpExistsForEmail?.otp) {
            return Response.json({
                status: false,
                message: "OTP not found for given email address. Kindly resend it"
            }, { status: 404 });
        }

        if (attemptedOtp !== otpExistsForEmail?.otp) {
            return Response.json({
                status: false,
                message: "Incorrect OTP"
            }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword
        });
        newUser.save();

        await OtpModel.deleteOne({ email });

        // TODO: Add function to send email for successfull registeration to the given email address.

        return Response.json({
            success: true,
            message: "Account successfully created"
        }, { status: 200 });
 
    } catch (error) {
        console.error("Error verifying OTP", error);
        return Response.json(
            {
                success: false,
                message: "Something went wrong on our end. Please try again later"
            },
            { status: 500 }
        )
    }
}

