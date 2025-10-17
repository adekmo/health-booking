import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { role } = await req.json();

  if (!["customer", "nutritionist", "admin"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const updatedUser = await User.findByIdAndUpdate(
    params.id,
    { role },
    { new: true }
  );

  if (!updatedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(updatedUser);
}
