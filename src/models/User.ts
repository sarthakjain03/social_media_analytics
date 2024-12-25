import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface User extends Document {
  userId: ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date
}

const UserSchema: Schema<User> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    index: true,
    auto: true,
    unique: true
  },
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
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;