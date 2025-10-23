import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Nutritionist from "@/models/Nutritionist";


export async function GET(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  try {
    let filter: any = {};
    if (status && ["pending", "confirmed", "cancelled"].includes(status)) {
      filter.status = status;
    }

    let bookings;
    if (session.user.role === "admin") {
      bookings = await Booking.find(filter)
        .populate("customerId")
        .populate({
          path: "nutritionistId",
          populate: { path: "userId" },
        })
        .sort({ createdAt: -1 });
    } else if (session.user.role === "customer") {
      bookings = await Booking.find({ customerId: session.user.id, ...filter })
        .populate("nutritionistId")
        .sort({ createdAt: -1 });
    } else if (session.user.role === "nutritionist") {
      const nutritionist = await Nutritionist.findOne({ userId: session.user.id });
      if (nutritionist) {
        bookings = await Booking.find({ nutritionistId: nutritionist._id, ...filter })
          .populate("customerId")
          .sort({ createdAt: -1 });
      } else {
        console.warn("Nutritionist profile not found for user:", session.user.id);
        bookings = [];
      }
    } else {
      bookings = [];
    }
    return NextResponse.json(bookings);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { nutritionistId, date, note, phone } = await req.json();

  try {
    const bookingDate = new Date(date);

    // Hitung rentang waktu sesi (1 jam)
    const startTime = new Date(bookingDate);
    const endTime = new Date(bookingDate);
    endTime.setHours(endTime.getHours() + 1);

    // pngcekan apakah sudah ada booking lain di waktu yang sama untuk nutritionist tsb
    const existingBooking = await Booking.findOne({
      nutritionistId,
      date: {
        $gte: startTime, // mulai dari jam tersebut
        $lt: endTime,    // hingga sebelum 1 jam berikutnya
      },
      status: { $ne: "cancelled" }, // abaikan booking yang dibatalkan
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "This time slot is already booked. Please choose another time." },
        { status: 400 }
      );
    }

    // harga per sesi dari nutritionist
    const nutritionist = await Nutritionist.findById(nutritionistId);
    if (!nutritionist) {
      return NextResponse.json({ error: "Nutritionist not found" }, { status: 404 });
    }

    const totalPrice = nutritionist.pricePerSession || 0;

    // kondisi Jika belum ada, buat booking baru
    const booking = await Booking.create({
      customerId: session.user.id,
      nutritionistId,
      date: bookingDate,
      note,
      phone,
      totalPrice,
      paymentStatus: "unpaid",
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

