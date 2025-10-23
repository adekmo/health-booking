import { INutritionist } from "@/models/Nutritionist";
import { IUser } from "@/models/User";

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
  phone?: string;
  totalPrice: number;
  paymentStatus: "unpaid" | "paid";
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingHistory {
  _id: string;
  customerId: string | IUser;
  nutritionistId: string | INutritionist;
  date: string;
  status: "pending" | "confirmed" | "cancelled";
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export type CalendarCustomer = {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
};

export type BookingEvent = {
  _id: string;
  title: string;
  start: Date;
  end: Date;
  status: "pending" | "confirmed" | "cancelled" | string;
  note?: string;
  phone?: string;
  customerId?: CalendarCustomer;
};
