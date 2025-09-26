// untuk GET all nutritionists (admin / public view list)

import { NextResponse } from "next/server";
import Nutritionist from "@/models/Nutritionist";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    const nutritionists = await Nutritionist.find().populate("userId", "name email");
    
    return NextResponse.json(nutritionists, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch nutritionists" }, { status: 500 });
  }
}
