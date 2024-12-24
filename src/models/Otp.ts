import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface Otp extends Document {
  id: ObjectId;
  email: string;
  otp: number;
  createdAt: Date;
}

const OtpSchema: Schema<Otp> = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    index: true,
    auto: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  otp: {
    type: Number,
    required: [true, "Otp is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "30m",
  },
});

const OtpModel =
  (mongoose.models.Otp as mongoose.Model<Otp>) ||
  mongoose.model<Otp>("Otp", OtpSchema);

export default OtpModel;
