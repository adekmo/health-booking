import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Nutritionist from "@/models/Nutritionist";

export async function GET(req: NextRequest, { params }: { params: Promise<{ customerId: string }> }) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const paramObject = await params;
    const customerId = paramObject.customerId;
    const nutritionist = await Nutritionist.findOne({ userId: session.user.id });
    if (!nutritionist)
      return NextResponse.json({ error: "Nutritionist not found" }, { status: 404 });

    // Ambil semua booking customer dengan nutritionist ini,
    // selain yang masih pending, dan sebelum hari ini
    const history = await Booking.find({
      customerId: customerId,
      nutritionistId: nutritionist._id,
      status: { $in: ["confirmed", "cancelled"] },
    //   date: { $lt: new Date() },
    })
      .sort({ date: -1 })
      .select("_id date status note createdAt updatedAt")
      .lean();

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }
}
