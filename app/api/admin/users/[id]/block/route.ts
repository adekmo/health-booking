import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { isBlocked } = await req.json();

  const updatedUser = await User.findByIdAndUpdate(
    params.id,
    { isBlocked },
    { new: true }
  );

  if (!updatedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(updatedUser);
}
