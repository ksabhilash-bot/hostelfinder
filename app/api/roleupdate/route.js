import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import User from "@/models/user";

export async function POST(req) {
  try {
    await connectDB();
    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json(
        { success: false, message: "Email and role are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "No user found" },
        { status: 404 }
      );
    }

    user.role = role;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "User role updated successfully",
      data: { email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Role update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
