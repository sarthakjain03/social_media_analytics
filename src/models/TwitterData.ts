import { TwitterPost, TwitterUserData } from "@/types/TwitterData";
import { TwitterChartData } from "@/types/Charts";
import mongoose, { Schema, Document } from "mongoose";

export interface TwitterData extends Document {
  userEmail: string;
  userData: TwitterUserData;
  post_ids: Array<string>;
  //posts: Array<TwitterPost>;
  chartsData: TwitterChartData;
  accessToken: string;
  refreshToken: string;
  tokenExpiry: Date;
  lastUpdated: Date | null;
}

const TwitterSchema: Schema<TwitterData> = new Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true
  },
  userData: {
    type: Object
  },
  post_ids: {
    type: [String]
  },
  // posts: {
  //   type: [Object]
  // },
  chartsData: {
    type: Object
  },
  accessToken: {
    type: String
  },
  refreshToken: {
    type: String
  },
  tokenExpiry: {
    type: Date
  },
  lastUpdated: {
    type: Date
  }
});

const TwitterDataModel =
  (mongoose.models.Twitter_User as mongoose.Model<TwitterData>) ||
  mongoose.model<TwitterData>("Twitter_User", TwitterSchema);

export default TwitterDataModel;