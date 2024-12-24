import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiration: Date;
  isVerified: boolean;
  usernameForX: string;
}

const UserSchema: Schema<User> = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verification Code is required"],
  },
  verifyCodeExpiration: {
    type: Date,
    required: [true, "Verification Code Expiration is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  usernameForX: {
    type: String,
    trim: true,
    unique: true
  }
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;