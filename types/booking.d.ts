export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface UserRef {
  _id: string;
  name: string;
  email?: string;
}

export interface NutritionistRef {
  _id: string;
  name: string;
  specialization?: string;
}

export interface Booking {
  _id: string;
  customerId: UserRef;
  nutritionistId:NutritionistRef;
  date: string;
  status: BookingStatus;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}
