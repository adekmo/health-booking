import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ConsultationNote from "@/models/ConsultationNote";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";


export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("bookingId");

  if (!bookingId) {
    return NextResponse.json({ error: "bookingId required" }, { status: 400 });
  }

  try {
    const note = await ConsultationNote.findOne({ bookingId }).populate("nutritionistId", "name email");
    return NextResponse.json(note || null);
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "nutritionist") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { bookingId, notes, recommendation, fileUrl } = await req.json();
    if (!bookingId || !notes || !recommendation) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const note = await ConsultationNote.create({
      bookingId,
      nutritionistId: session.user.id,
      notes,
      recommendation,
      fileUrl,
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}

