import dbConnect from "@/database/dbConnect";
import TwitterDataModel from "@/models/TwitterData";
import axios from "axios";

export async function GET(_request: Request, { params }: { params: Promise<{ email: string }> }) {
    await dbConnect();

    try {
        const email = (await params).email;

        const userData = await TwitterDataModel.findOne({ userEmail: email });
        if (!userData) {
            return Response.json({
                success: false,
                message: "User has not connected their X account"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "User's X data retrieved successfully",
            data: {
                chartsData: userData.chartsData
            }
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error getting data from X: ", error);
        return Response.json({
            success: false,
            message: "Error getting data from X"
        }, { status: 500 });
    }
}

