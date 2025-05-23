import { AllTabCardsData, ChartData, GithubChartData } from "@/types/Charts";
import mongoose, { Schema, Document } from "mongoose";

interface ChartsData extends Document {
  userEmail: string;
  cardsData: AllTabCardsData | null;
  twitterData: ChartData | null;
  githubData: GithubChartData | null;
  instagramData: ChartData | null;
}

const ChartsSchema: Schema<ChartsData> = new Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true,
  },
  cardsData: {
    type: Object,
  },
  twitterData: {
    type: Object,
  },
  githubData: {
    type: Object,
  },
  instagramData: {
    type: Object,
  }
});

const ChartsDataModel =
  (mongoose.models.User_Chart as mongoose.Model<ChartsData>) ||
  mongoose.model<ChartsData>("User_Chart", ChartsSchema);

export default ChartsDataModel;
