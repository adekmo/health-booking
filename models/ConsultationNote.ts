import mongoose, { Schema, Document, models } from "mongoose";

export interface IConsultationNote extends Document {
  bookingId: mongoose.Types.ObjectId;
  nutritionistId: mongoose.Types.ObjectId;
  notes: string;
  recommendation: string;
  fileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationNoteSchema = new Schema<IConsultationNote>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    nutritionistId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
      required: true,
      trim: true,
    },
    recommendation: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default models.ConsultationNote ||
  mongoose.model<IConsultationNote>("ConsultationNote", ConsultationNoteSchema);
