import dbConnect from "@/database/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { resetToken } = await request.json();
        const foundEmailWithToken = await UserModel.findOne({ resetToken });

        if (!foundEmailWithToken) {
            return Response.json({
                success: false,
                message: "Invalid Link"
            }, { status: 404 });

        } else if (Number(foundEmailWithToken.resetTokenExpiry) <= Date.now()) {
            const results = await UserModel.updateOne({ email: foundEmailWithToken.email }, {
                $set: { resetToken: null, resetTokenExpiry: null }
            });

            return Response.json({
                success: false,
                message: "Link expired. Please generate a new link to reset"
            }, { status: 410 });
        }

        return Response.json({
            success: true,
            message: "Valid Link"
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error in validation of reset link", error);
        return Response.json(
            {
                success: false,
                message: "Something went wrong on our end. Please try again later"
            },
            { status: 500 }
        )
    }
}

