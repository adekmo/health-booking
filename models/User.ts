import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "customer" | "nutritionist" | "admin";
  photo?: string;
  phone?: string;
  address?: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "nutritionist", "admin"],
      default: "customer",
    },
    photo: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;
