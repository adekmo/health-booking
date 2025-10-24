import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Nutritionist from "@/models/Nutritionist";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ nutritionistId: string }> }
) {

  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "nutritionist") {
      return NextResponse.json({ error: "Forbidden. Only authorized nutritionists can access these stats." }, { status: 403 });
  }
  try {
    const paramObject = await params;
    const nutritionistUserId = paramObject.nutritionistId;
    // Keamanan Tambahan: Pastikan ID di URL sama dengan ID user yang login
    if (session.user.id !== nutritionistUserId) {
        return NextResponse.json({ error: "Access Denied. Cannot view another nutritionist's stats." }, { status: 403 });
    }
    
    // Validasi ID format
    if (!mongoose.Types.ObjectId.isValid(nutritionistUserId)) {
      return NextResponse.json(
        { error: "Invalid User ID format" },
        { status: 400 }
      );
    }
    
    // 2. Cari Profil Nutritionist (menggunakan User ID)
    const nutritionist = await Nutritionist.findOne({
      userId: nutritionistUserId,
    });

    if (!nutritionist) {
      return NextResponse.json(
        { error: "Nutritionist profile not found" },
        { status: 404 }
      );
    }

    // --- Definisi Rentang Waktu (Bulan Ini) ---
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    // Kita akan menggunakan filter waktu di client side/memory (kecuali Anda ingin menggunakan aggregation Mongoose)

    // 3. Ambil semua booking milik nutritionist (MENGGUNAKAN NUTRITIONIST ID)
    const bookings = await Booking.find({ nutritionistId: nutritionist._id }).lean();

    if (!bookings.length) {
      // Jika tidak ada booking sama sekali, kembalikan struktur data kosong
      return NextResponse.json({
        totalConsultations: 0,
        uniqueCustomers: 0,
        conversionRate: 0,
        totalPending: 0,
        totalCancelled: 0,
      });
    }

    // --- Statistik Berdasarkan Data di Memori ---

    // Total konsultasi bulan ini (status confirmed)
    const confirmedThisMonth = bookings.filter((b) => {
      const d = new Date(b.date);
      // Hanya hitung status confirmed yang berada dalam rentang bulan ini
      return b.status === "confirmed" && d >= startOfMonth && d <= endOfMonth;
    });
    const totalConsultations = confirmedThisMonth.length;

    // Jumlah customer unik (berdasarkan customerId, dihitung dari SEMUA booking)
    const uniqueCustomers = new Set(
      bookings.map((b) => b.customerId.toString())
    ).size;

    // Hitung conversion rate: confirmed / total booking
    const totalBookings = bookings.length;
    const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
    
    // Perbaikan: Pastikan pembagian tidak menghasilkan NaN
    const conversionRate =
      totalBookings > 0 ? Math.round((confirmedCount / totalBookings) * 100) : 0;

    // Hitung status lain (dihitung dari SEMUA booking)
    const totalPending = bookings.filter((b) => b.status === "pending").length;
    const totalCancelled = bookings.filter((b) => b.status === "cancelled").length;

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