// app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";


export async function GET(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role"); // customer / nutritionist

  try {
    let bookings;
    if (role === "customer") {
      bookings = await Booking.find({ customerId: session.user.id }).populate("nutritionistId");
    } else if (role === "nutritionist") {
      bookings = await Booking.find({ nutritionistId: session.user.id }).populate("customerId");
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

  const { nutritionistId, date, note } = await req.json();

  try {
    const booking = await Booking.create({
      customerId: session.user.id,
      nutritionistId,
      date,
      note,
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

