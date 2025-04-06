import dbConnect from "@/database/dbConnect";
import ChartsDataModel from "@/models/ChartsData";
import InstagramDataModel from "@/models/InstagramData";
import TwitterDataModel from "@/models/TwitterData";
import GithubDataModel from "@/models/GithubData";

export async function GET(_request: Request, { params }: { params: Promise<{ email: string }> }) {
    await dbConnect();

    try {
        const { email } = await params;

        // Fetch data from all sources
        const [userGithubData, userXData, userIgData, chartsData] = await Promise.all([
            GithubDataModel.findOne({ userEmail: email }),
            TwitterDataModel.findOne({ userEmail: email }),
            InstagramDataModel.findOne({ userEmail: email }),
            ChartsDataModel.findOne({ userEmail: email }),
        ]);

        // Require charts data to exist (as it's likely essential)
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
                    cardsData: chartsData.cardsData ?? null,
                    twitterData: chartsData.twitterData ?? null,
                    githubData: chartsData.githubData ?? null,
                    instagramData: chartsData.instagramData ?? null
                },
                lastUpdateOfX: userXData?.lastUpdated ?? null,
                lastUpdateOfInstagram: userIgData?.lastUpdated ?? null,
                lastUpdateOfGithub: userGithubData?.lastUpdated ?? null
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
