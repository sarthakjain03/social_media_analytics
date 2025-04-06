import mongoose, { Schema, Document } from "mongoose";
import { GithubUserData } from "@/types/GithubData";

interface GithubData extends Document {
  userEmail: string;
  username: string;
  userData: GithubUserData | null;
  lastUpdated: Date | null;
}

const GithubSchema: Schema<GithubData> = new Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  userData: {
    type: Object,
  },
  lastUpdated: {
    type: Date,
  },
});

const GithubDataModel =
  (mongoose.models.Github_User as mongoose.Model<GithubData>) ||
  mongoose.model<GithubData>("Github_User", GithubSchema);

export default GithubDataModel;