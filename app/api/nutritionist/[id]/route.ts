// untuk  GET one nutritionist (customer/public), PUT (update), DELETE (admin only)

import { NextRequest, NextResponse } from "next/server";
import Nutritionist from "@/models/Nutritionist";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const paramObject = await params;
    const nutritionistId = paramObject.id;

    const nutritionist = await Nutritionist.findById(nutritionistId).populate("userId", "name email");

    if (!nutritionist) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(nutritionist, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch nutritionist" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {

  await connectDB();
  const session = await getServerSession(authOptions);
  
  // Otorisasi: Hanya user terautentikasi yang boleh melanjutkan
  if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const paramObject = await params;
    const nutritionistId = paramObject.id;
    const body = await req.json();
    const existingProfile = await Nutritionist.findById(nutritionistId);
    if (!existingProfile) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    const isOwner = existingProfile.userId.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isAdmin && !isOwner) {
        return NextResponse.json({ error: "Forbidden. You can only update your own profile." }, { status: 403 });
    }

    // Update data
    const updated = await Nutritionist.findByIdAndUpdate(nutritionistId, body, { 
      new: true,
      runValidators: true // Pastikan data yang masuk valid sesuai Schema
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error update data:", error);
    return NextResponse.json({ error: "Failed to update nutritionist" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  await connectDB();
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Only Admin can delete profiles." }, { status: 403 });
  }

  try {
    const paramObject = await params;
    const nutritionistId = paramObject.id;

    const deleted = await Nutritionist.findByIdAndDelete(nutritionistId);
    
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error delete data:", error);
    return NextResponse.json({ error: "Failed to delete nutritionist" }, { status: 500 });
  }
}
