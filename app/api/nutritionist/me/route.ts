import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Nutritionist from "@/models/Nutritionist";
// import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";


export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "nutritionist") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const nutritionist = await Nutritionist.findOne({ userId: session.user.id }).populate("userId", "name email");
    return NextResponse.json(nutritionist, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "nutritionist") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const updated = await Nutritionist.findOneAndUpdate(
      { userId: session.user.id },
      body,
      { upsert: true, new: true } // create jika belum ada
    );
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error update data:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
