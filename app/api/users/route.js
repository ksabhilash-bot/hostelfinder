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
