// app/api/admin/insights/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d";

    let startDate = new Date();
    if (range === "30d") startDate.setDate(startDate.getDate() - 30);
    else if (range === "90d") startDate.setDate(startDate.getDate() - 90);
    else if (range === "all") startDate = new Date(0);
    else startDate.setDate(startDate.getDate() - 7);

    // Fetch data dari DB
    const [bookings, users] = await Promise.all([
      Booking.find({ createdAt: { $gte: startDate } }).lean(),
      User.find({ createdAt: { $gte: startDate } }).lean(),
    ]);

    const now = new Date();
    const dayCount =
      range === "30d" ? 30 : range === "90d" ? 90 : range === "all" ? 60 : 7;

    // Grafik tren booking per hari
    const bookingTrends = Array.from({ length: dayCount }).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (dayCount - 1 - i));
      const dateKey = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const consultations = bookings.filter(
        (b) => new Date(b.createdAt).toDateString() === d.toDateString()
      ).length;
      return { date: dateKey, consultations };
    });

    // Status booking
    const statusData = [
      {
        name: "Confirmed",
        value: bookings.filter((b) => b.status === "confirmed").length,
      },
      {
        name: "Pending",
        value: bookings.filter((b) => b.status === "pending").length,
      },
      {
        name: "Cancelled",
        value: bookings.filter((b) => b.status === "cancelled").length,
      },
    ];

    // Grafik user baru
    const userTrends = Array.from({ length: dayCount }).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (dayCount - 1 - i));
      const dateKey = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const newUsers = users.filter(
        (u) => new Date(u.createdAt).toDateString() === d.toDateString()
      ).length;
      return { date: dateKey, users: newUsers };
    });

    return NextResponse.json({
      consultationData: bookingTrends,
      statusData,
      userData: userTrends,
    });
  } catch (error) {
    console.error("Error fetching admin insights:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin insights" },
      { status: 500 }
    );
  }
}
