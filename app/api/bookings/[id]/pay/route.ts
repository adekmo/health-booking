import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const booking = await Booking.findById(params.id);
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    if (session.user.role === "customer") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    booking.paymentStatus = "paid";
    await booking.save();

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update payment status" }, { status: 500 });
  }
}
