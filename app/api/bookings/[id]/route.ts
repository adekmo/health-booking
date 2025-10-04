// app/api/bookings/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status } = await req.json();
  if (!["confirmed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const booking = await Booking.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );
    return NextResponse.json(booking);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
