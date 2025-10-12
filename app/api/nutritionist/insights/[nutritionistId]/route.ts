import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Nutritionist from "@/models/Nutritionist";
import mongoose from "mongoose";
// import User from "@/models/User";

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

    // Grafik tren konsultasi (7 hari terakhir)
    const now = new Date();
    const past7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      const dateKey = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const consultations = bookings.filter((b) => {
        const bd = new Date(b.date);
        return (
          b.status === "confirmed" &&
          bd.toDateString() === d.toDateString()
        );
      }).length;
      return { date: dateKey, consultations };
    });

    // status booking
    const statusData = [
      { name: "Confirmed", value: bookings.filter((b) => b.status === "confirmed").length },
      { name: "Pending", value: bookings.filter((b) => b.status === "pending").length },
      { name: "Cancelled", value: bookings.filter((b) => b.status === "cancelled").length },
    ];

    // Top customers
    const customerCounts: Record<string, { name: string; total: number }> = {};
    bookings.forEach((b) => {
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
      consultationData: past7Days,
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
