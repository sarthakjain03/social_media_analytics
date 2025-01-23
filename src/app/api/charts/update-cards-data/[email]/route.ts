import dbConnect from "@/database/dbConnect";
import ChartsDataModel from "@/models/ChartsData";
import { getFormattedCardsData } from "@/utils/cardsDataFormatter";

export async function GET(_request: Request, { params }: { params: Promise<{ email: string }> }) {
    await dbConnect();

    try {
        const email = (await params).email;

        const chartsData = await ChartsDataModel.findOne({ userEmail: email });
        if (!chartsData) {
            return Response.json({
                success: false,
                message: "User charts and cards data not found"
            }, { status: 404 });
        }

        if (chartsData?.cardsData?.retrievalDate && Date.now() - Number(chartsData.cardsData.retrievalDate) < 86400000) {
            return Response.json({
                success: true,
                message: "User cards data is up to date"
            }, { status: 304 });
        }

        const updatedCards = getFormattedCardsData({
            twitter: chartsData.twitterData,
            linkedin: chartsData.linkedinData,
            instagram: chartsData.instagramData,
            prevCardsData: chartsData.cardsData
        });

        const results = await ChartsDataModel.updateOne({ userEmail: email }, {
            $set: {
                cardsData: updatedCards
            }
        });

        return Response.json({
            success: true,
            message: "User cards data updated successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating cards data in db: ", error);
        return Response.json({
            success: false,
            message: "Error updating cards data"
        }, { status: 500 });
    }
}
