import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Booking from "@/models/Booking";

export async function GET() {
  await connectDB();

  const totalUsers = await User.countDocuments();
  const totalCustomers = await User.countDocuments({ role: "customer" });
  const totalNutritionists = await User.countDocuments({ role: "nutritionist" });
  const totalBookings = await Booking.countDocuments();

  const statusStats = await Booking.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  return NextResponse.json({
    totalUsers,
    totalCustomers,
    totalNutritionists,
    totalBookings,
    statusStats,
  });
}
