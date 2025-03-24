import mongoose, { Schema, Document } from "mongoose";
import { IGUserData } from "@/types/InstagramData";

interface InstagramData extends Document {
  userEmail: string;
  accessCumRefreshToken: string;
  tokenExpiry: Date;
  lastUpdated: Date | null;
  userData: IGUserData | null;
}

const InstagramSchema: Schema<InstagramData> = new Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true,
  },
  userData: {
    type: Object,
  },
  accessCumRefreshToken: {
    type: String,
  },
  tokenExpiry: {
    type: Date,
  },
  lastUpdated: {
    type: Date,
  },
});

const InstagramDataModel =
  (mongoose.models.Instagram_User as mongoose.Model<InstagramData>) ||
  mongoose.model<InstagramData>("Instagram_User", InstagramSchema);

export default InstagramDataModel;