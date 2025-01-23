import dbConnect from "@/database/dbConnect";
import ChartsDataModel from "@/models/ChartsData";
import TwitterDataModel from "@/models/TwitterData";

export async function GET(_request: Request, { params }: { params: Promise<{ email: string }> }) {
    await dbConnect();

    try {
        const email = (await params).email;

        const userXData = await TwitterDataModel.findOne({ userEmail: email });
        if (!userXData) {
            return Response.json({
                success: false,
                message: "User twitter data not found"
            }, { status: 404 });
        }

        const chartsData = await ChartsDataModel.findOne({ userEmail: email });
        if (!chartsData) {
            return Response.json({
                success: false,
                message: "User charts and cards data not found"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "User charts data retrieved successfully",
            data: {
                chartsData: {
                    cardsData: chartsData.cardsData,
                    twitterData: chartsData.twitterData,
                    linkedinData: chartsData.linkedinData,
                    instagramData: chartsData.instagramData
                },
                lastUpdateOfX: userXData.lastUpdated
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Error retrieving charts data from db: ", error);
        return Response.json({
            success: false,
            message: "Error retrieving charts data"
        }, { status: 500 });
    }
}
