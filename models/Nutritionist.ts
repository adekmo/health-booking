import mongoose, { Schema, Document, Types } from "mongoose";

export interface INutritionist extends Document {
  userId: Types.ObjectId; // referensi ke User
  name: string;
  specialization: string;
  experienceYears: number;
  license?: string;
  bio: string;
  contact?: string;
  location?: string;
  pricePerSession: number; // harga per konsultasi
  availableDays: string[]; // ["monday", "tuesday", ...]
  availableHours: {
    start: string; // "09:00"
    end: string;   // "17:00"
  };
  photo?: string; // URL foto profil
  createdAt: Date;
  updatedAt: Date;
}

const NutritionistSchema = new Schema<INutritionist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    experienceYears: { type: Number, required: true },
    license: { type: String },
    bio: { type: String, required: true },
    contact: { type: String },
    location: { type: String },
    pricePerSession: { type: Number, required: true },
    availableDays: [{ type: String, required: true }],
    availableHours: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    photo: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Nutritionist ||
  mongoose.model<INutritionist>("Nutritionist", NutritionistSchema);
