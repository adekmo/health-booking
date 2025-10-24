// untuk  GET one nutritionist (customer/public), PUT (update), DELETE (admin only)

import { NextRequest, NextResponse } from "next/server";
import Nutritionist from "@/models/Nutritionist";
import { connectDB } from "@/lib/mongodb";

type Params = {
  params: { id: string };
};

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB();

    const nutritionist = await Nutritionist.findById(params.id).populate("userId", "name email");

    if (!nutritionist) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(nutritionist, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch nutritionist" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB();

    const body = await req.json();
    const updated = await Nutritionist.findByIdAndUpdate(params.id, body, { new: true });

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error update data:", error);
    return NextResponse.json({ error: "Failed to update nutritionist" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await connectDB();

    await Nutritionist.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error delete data:", error);
    return NextResponse.json({ error: "Failed to delete nutritionist" }, { status: 500 });
  }
}
