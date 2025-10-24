// app/api/bookings/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Nutritionist from "@/models/Nutritionist";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const booking = await Booking.findById(params.id)
      .populate("customerId", "name email")
      .populate("nutritionistId", "name specialization pricePerSession");

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status } = await req.json();

  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const booking = await Booking.findById(params.id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (session.user.role === "customer") {
      // mengubah status booking customer (miliknya sendiri)
      if (booking.customerId.toString() !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else if (session.user.role === "nutritionist") {
      // Nutritionist hanya boleh ubah booking yang terkait dengan dirinya
      const nutritionist = await Nutritionist.findOne({
        userId: session.user.id,
      });

      if (!nutritionist) {
        return NextResponse.json({ error: "Nutritionist not found" }, { status: 404 });
      }

      if (booking.nutritionistId.toString() !== nutritionist._id.toString()) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else {
      // Role lain tidak diizinkan
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    booking.status = status;
    await booking.save();
    return NextResponse.json(booking);
  } catch (err) {
    console.error("Error update data:", err);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
