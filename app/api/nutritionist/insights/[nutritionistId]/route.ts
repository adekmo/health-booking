import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Nutritionist from "@/models/Nutritionist";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest, { params }: { params: Promise<{ nutritionistId: string }> }) {
  await connectDB();
  
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "nutritionist") {
      return NextResponse.json({ error: "Forbidden. Only authorized nutritionists can access this data." }, { status: 403 });
  }
  try {
    const paramObject = await params;
    const nutritionistUserId = paramObject.nutritionistId;

    if (!mongoose.Types.ObjectId.isValid(nutritionistUserId)) {
      return NextResponse.json(
        { error: "Invalid User ID format" },
        { status: 400 }
      );
    }

    if (session.user.id !== nutritionistUserId) {
        return NextResponse.json({ error: "Access Denied. Cannot view another nutritionist's dashboard." }, { status: 403 });
    }

    const nutritionist = await Nutritionist.findOne({
      userId: nutritionistUserId, 
    });
    if (!nutritionist) {
      return NextResponse.json(
        { error: "Nutritionist profile not found" },
        { status: 404 }
      );
    }

    const bookings = await Booking.find({ nutritionistId: nutritionist._id })
      .populate("customerId", "name")
      .lean();
    
      if (!bookings.length) {
      // Jika tidak ada booking sama sekali, kembalikan struktur data kosong
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

    // --- Pemrosesan Data Berdasarkan Range ---
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d";

    let startDate = new Date();
    if (range === "30d") startDate.setDate(startDate.getDate() - 30);
    else if (range === "90d") startDate.setDate(startDate.getDate() - 90);
    else if (range === "all") startDate = new Date(0); // Epoch time
    else startDate.setDate(startDate.getDate() - 7);

    // Filter booking berdasarkan range waktu
    const filteredBookings = bookings.filter(
      (b) => new Date(b.date) >= startDate
    );

    // Grafik tren konsultasi
    const now = new Date();
    // Tentukan jumlah hari berdasarkan range, jika 'all' defaultkan ke 90 hari untuk grafik
    const dayCount = range === "30d" ? 30 : range === "90d" ? 90 : range === "all" ? 90 : 7; 
    
    // Siapkan array untuk rentang waktu yang akan ditampilkan di grafik
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
          // Hanya hitung status confirmed
          b.status === "confirmed" && 
          bd.toDateString() === d.toDateString()
        );
      }).length;
      
      return { date: dateKey, consultations };
    });

    // Data status booking
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
      // Menggunakan tipe assertion yang lebih aman
      const customerName = (b.customerId as { name: string }).name || "Unknown"; 
      
      if (!customerCounts[customerName]) {
        customerCounts[customerName] = { name: customerName, total: 0 };
      }
      customerCounts[customerName].total++;
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
