import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const nutritionistId = searchParams.get("nutritionistId");
  const date = searchParams.get("date");

  if (!nutritionistId || !date) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const selectedDate = new Date(date);
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    // Ambil semua booking di hari itu
    const bookings = await Booking.find({
      nutritionistId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: "cancelled" },
    });

    // Ambil jam-jam yang sudah dipesan (format "HH:00")
    const bookedTimes = bookings.map((b) => {
      const d = new Date(b.date);
      return `${d.getHours().toString().padStart(2, "0")}:00`;
    });

    return NextResponse.json(bookedTimes);
  } catch (err) {
    console.error("Error fetching booked times:", err);
    return NextResponse.json({ error: "Failed to fetch booked times" }, { status: 500 });
  }
}
