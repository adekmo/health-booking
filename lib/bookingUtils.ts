import { BookingEvent } from "@/types/booking";

interface BookingInput {
  _id: string;
  date: string;
  durationInMinutes?: number;
  status: string;
  note?: string;
  phone?: string;
  customerId?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
}

export function mapBookingData(b: BookingInput): BookingEvent {
  const start = new Date(b.date);
  const end = new Date(start.getTime() + (b.durationInMinutes || 60) * 60 * 1000);

  return {
    _id: b._id,
    title: b.customerId?.name ?? "Unknown Customer",
    start,
    end,
    status: b.status,
    note: b.note,
    phone: b.phone,
    customerId: {
      _id: b.customerId?._id,
      name: b.customerId?.name ?? "",
      email: b.customerId?.email ?? "",
      phone: b.customerId?.phone ?? "",
    },
  };
}
