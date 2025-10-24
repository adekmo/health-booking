import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(req: NextRequest, context: { params: { id: string } } | { params: Promise<{ id: string }>}) {

  const params = await (context.params instanceof Promise
    ? context.params
    : Promise.resolve(context.params));
  try {
    await connectDB();

    const userId = params.id;
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return NextResponse.json({
        message: user.isBlocked ? "User blocked" : "User unblocked",
      });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
