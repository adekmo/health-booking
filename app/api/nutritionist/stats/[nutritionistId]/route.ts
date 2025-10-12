import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Nutritionist from "@/models/Nutritionist";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { nutritionistId: string } }
) {
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

    // rentang waktu bulan ini
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Ambil semua booking milik nutritionist
    const bookings = await Booking.find({ nutritionistId: nutritionist._id });

    // Debug log
    console.log("📊 Total bookings found:", bookings.length);

    if (!bookings.length) {
      return NextResponse.json({
        totalConsultations: 0,
        uniqueCustomers: 0,
        conversionRate: 0,
        totalPending: 0,
        totalCancelled: 0,
      });
    }

    // ✅ Total konsultasi bulan ini (status confirmed)
    const confirmedThisMonth = bookings.filter((b) => {
      const d = new Date(b.date);
      return b.status === "confirmed" && d >= startOfMonth && d <= endOfMonth;
    });
    const totalConsultations = confirmedThisMonth.length;

    // ✅ Jumlah customer unik (berdasarkan customerId)
    const uniqueCustomers = new Set(
      bookings.map((b) => b.customerId.toString())
    ).size;

    // ✅ Hitung conversion rate: confirmed / total booking
    const totalBookings = bookings.length;
    const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
    const conversionRate =
      totalBookings > 0 ? Math.round((confirmedCount / totalBookings) * 100) : 0;

    // ✅ Hitung status lain
    const totalPending = bookings.filter((b) => b.status === "pending").length;
    const totalCancelled = bookings.filter((b) => b.status === "cancelled").length;

    // ✅ Kembalikan data
    return NextResponse.json({
      totalConsultations,
      uniqueCustomers,
      conversionRate,
      totalPending,
      totalCancelled,
    });
  } catch (error) {
    console.error("Error fetching nutritionist stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch nutritionist stats" },
      { status: 500 }
    );
  }
}
