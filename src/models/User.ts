import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  resetToken: string | null;
  resetTokenExpiry: Date | null;
  createdAt: Date;
  isXConnected: boolean;
  isInstagramConnected: boolean;
  isLinkedinConnected: boolean;
  isYoutubeConnected: boolean;
}

const UserSchema: Schema<User> = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: 2
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
  resetToken: {
    type: String
  },
  resetTokenExpiry: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  isXConnected: {
    type: Boolean,
    default: false
  },
  isInstagramConnected: {
    type: Boolean,
    default: false
  },
  isLinkedinConnected: {
    type: Boolean,
    default: false
  },
  isYoutubeConnected: {
    type: Boolean,
    default: false
  },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;