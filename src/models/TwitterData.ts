import mongoose, { Schema, Document } from "mongoose";

export interface Twitter extends Document {
  userEmail: string;
  lastUpdated: Date | null;
  accessToken: string;
  refreshToken: string;
  tokenExpiry: Date;
  data: object | null;
}

const TwitterSchema: Schema<Twitter> = new Schema({
  userEmail: {
    type: String,
    unique: true
  },
  lastUpdated: {
    type: Date
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
  data: {
    type: Object
  }
});

const TwitterDataModel =
  (mongoose.models.Twitter as mongoose.Model<Twitter>) ||
  mongoose.model<Twitter>("Twitter_Data", TwitterSchema);

export default TwitterDataModel;