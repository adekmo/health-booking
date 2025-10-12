import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Nutritionist from "@/models/Nutritionist";
import mongoose from "mongoose";

export async function GET(req: NextRequest, { params }: { params: { nutritionistId: string } }) {
  try {
    await connectDB();

    const { nutritionistId } = params;
    if (!nutritionistId) {
      return NextResponse.json(
        { error: "nutritionistId is required" },
        { status: 400 }
      );
    }

    const nutritionist = await Nutritionist.findOne({
          userId: new mongoose.Types.ObjectId(nutritionistId),
        });
    if (!nutritionist) {
        return NextResponse.json(
            { error: "Nutritionist not found for this user" },
            { status: 404 }
        );
    }

    const bookings = await Booking.find({ nutritionistId: nutritionist._id })
      .populate("customerId", "name")
      .lean();

    if (!bookings.length) {
      return NextResponse.json({
        consultationData: [],
        statusData: [
          { name: "Confirmed", value: 0 },
          { name: "Pending", value: 0 },
          { name: "Cancelled", value: 0 },
        ],
        topCustomers: [],
      });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d";

    let startDate = new Date();
    if (range === "30d") startDate.setDate(startDate.getDate() - 30);
    else if (range === "90d") startDate.setDate(startDate.getDate() - 90);
    else if (range === "all") startDate = new Date(0);
    else startDate.setDate(startDate.getDate() - 7);

    const filteredBookings = bookings.filter(
      (b) => new Date(b.date) >= startDate
    );

    // Grafik tren konsultasi (7 hari terakhir)
    const now = new Date();
    const dayCount = range === "30d" ? 30 : range === "90d" ? 90 : range === "all" ? 60 : 7;
    const pastDays = Array.from({ length: dayCount }).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (dayCount - 1 - i));
      const dateKey = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const consultations = filteredBookings.filter((b) => {
        const bd = new Date(b.date);
        return (
          b.status === "confirmed" && bd.toDateString() === d.toDateString()
        );
      }).length;
      return { date: dateKey, consultations };
    });

    // status booking
    const statusData = [
      {
        name: "Confirmed",
        value: filteredBookings.filter((b) => b.status === "confirmed").length,
      },
      {
        name: "Pending",
        value: filteredBookings.filter((b) => b.status === "pending").length,
      },
      {
        name: "Cancelled",
        value: filteredBookings.filter((b) => b.status === "cancelled").length,
      },
    ];

    // Top customers
    const customerCounts: Record<string, { name: string; total: number }> = {};
    filteredBookings.forEach((b) => {
      if (!b.customerId) return;
      const name = (b.customerId as any).name || "Unknown";
      if (!customerCounts[name]) {
        customerCounts[name] = { name, total: 0 };
      }
      customerCounts[name].total++;
    });
    const topCustomers = Object.values(customerCounts)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return NextResponse.json({
      consultationData: pastDays,
      statusData,
      topCustomers,
    });
  } catch (error) {
    console.error("Error fetching nutritionist insights:", error);
    return NextResponse.json(
      { error: "Failed to fetch nutritionist insights" },
      { status: 500 }
    );
  }
}
