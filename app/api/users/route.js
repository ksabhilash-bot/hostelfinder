import { connectDB } from "@/lib/mongo";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    // Use upsert to either create or update
    const user = await User.findOneAndUpdate(
      { uid: data.uid }, // Find by uid
      {
        uid: data.uid,
        name: data.name,
        email: data.email,
        image: data.image,
        updatedAt: new Date(),
      },
      {
        new: true, // Return updated document
        upsert: true, // Create if doesn't exist
        setDefaultsOnInsert: true, // Apply schema defaults on insert
      }
    );

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("User API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}