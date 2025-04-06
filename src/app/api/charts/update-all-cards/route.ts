import dbConnect from "@/database/dbConnect";
import ChartsDataModel from "@/models/ChartsData";
import { getFormattedCardsData } from "@/utils/cardsDataFormatter";

export async function GET(_request: Request) {
    await dbConnect();

    try {
        const allChartsData = await ChartsDataModel.find();

        if (!allChartsData || allChartsData.length === 0) {
            return Response.json({
                success: false,
                message: "No user charts and cards data found"
            }, { status: 404 });
        }

        const updatePromises = allChartsData.map(async (chartsData) => {
            if (chartsData.userEmail === "dummy@example.com") { // Skip dummy user
                return null;
            }

            if (chartsData?.cardsData?.retrievalDate && Date.now() - Number(chartsData.cardsData.retrievalDate) < 86400000) {
                // Skip updating if data is up-to-date
                return null;
            }

            const updatedCards = getFormattedCardsData({
                twitter: chartsData.twitterData,
                github: chartsData.githubData,
                instagram: chartsData.instagramData,
                prevCardsData: chartsData.cardsData
            });

            return ChartsDataModel.updateOne(
                { _id: chartsData._id },
                { $set: { cardsData: updatedCards } }
            );
        });

        // Execute all update operations
        await Promise.all(updatePromises);

        return Response.json({
            success: true,
            message: "User cards data updated successfully for all users"
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating all users' cards data in db: ", error);
        return Response.json({
            success: false,
            message: "Error updating all users' cards data"
        }, { status: 500 });
    }
}
