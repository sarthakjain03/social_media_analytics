import dbConnect from "@/database/dbConnect";
import InstagramDataModel from "@/models/InstagramData";
import ChartsDataModel from "@/models/ChartsData";
import { formatIGChartData, getInstagramMetricsData } from "@/utils/formatIGData";
import axios from "axios";

export async function GET(_request: Request) {
    await dbConnect();

    try {
        const allIgUsers = await InstagramDataModel.find(); // Fetch all users

        if (!allIgUsers || allIgUsers.length === 0) {
            return Response.json({
                success: false,
                message: "No users found to update"
            }, { status: 404 });
        }

        for (const igUser of allIgUsers) {
            const email = igUser.userEmail;

            if (email === "dummy@example.com") { // Skip dummy user
                continue;
            }

            const prevChartsData = await ChartsDataModel.findOne({ userEmail: email });
    
            if (!prevChartsData) {
                return Response.json({
                    success: false,
                    message: "User charts data not found"
                }, { status: 404 });
            }
    
            const userIdParams = {
                fields: 'user_id,username,followers_count',
                access_token: igUser?.accessCumRefreshToken
            };
            const igUserIdResponse = await axios.get('https://graph.instagram.com/v22.0/me', { params: userIdParams })
    
            const userId = igUserIdResponse?.data?.user_id;
            const params = {
                access_token: igUser?.accessCumRefreshToken,
                metric_type: 'total_value',
                metric: 'accounts_engaged,impressions,replies,saves,shares,views,comments,likes',
                period: 'day'
            };
    
            const insightsResponse = await axios.get(`https://graph.instagram.com/${userId}/insights`, { params });
    
            const dataArray = insightsResponse?.data?.data;
            const metricTotals = getInstagramMetricsData(dataArray);
            const updatedChartsData = formatIGChartData({ ...metricTotals, totalFollowers: Number(igUserIdResponse?.data?.followers_count), prevChartsData: prevChartsData.instagramData })
    
            await InstagramDataModel.updateOne({ userEmail: email }, {
                $set: {
                    lastUpdated: Date.now(),
                    userData: {
                        ig_userId: igUserIdResponse?.data?.user_id,
                        username: igUserIdResponse?.data?.username,
                        followers: igUserIdResponse?.data?.followers_count
                    }
                }
            })
    
            await ChartsDataModel.updateOne({ userEmail: email }, {
                $set: {
                    instagramData: updatedChartsData
                }
            });
        }

        return Response.json({
            success: true,
            message: "All users' instagram data updated successfully"
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error updating Instagram user's data: ", error);
        return Response.json({
            success: false,
            message: "Error updating Instagram user's data"
        }, { status: 500 });
    }
}