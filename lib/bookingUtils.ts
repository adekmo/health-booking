import { BookingEvent } from "@/types/booking";

export function mapBookingData(b: any): BookingEvent {
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
