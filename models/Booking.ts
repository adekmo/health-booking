// models/Booking.ts
import mongoose, { Schema, Document, models } from "mongoose";

export interface IBooking extends Document {
  customerId: mongoose.Types.ObjectId;
  nutritionistId: mongoose.Types.ObjectId;
  date: Date;
  status: "pending" | "confirmed" | "cancelled";
  note?: string;
  phone?: string;
  totalPrice: number;
  paymentStatus: "unpaid" | "paid";
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    nutritionistId: { type: Schema.Types.ObjectId, ref: "Nutritionist", required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    note: { type: String },
    phone: { type: String },
    totalPrice: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

export default models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
