import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Hostel from "@/models/hostel";
import User from "@/models/user";

// CREATE hostel
export async function POST(req) {
  try {
    await connectDB();
    const { name, images, address, price, description, provider } =
      await req.json();

    if (!name || !price || !provider || !address) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const hostel = await Hostel.create({
      name,
      images,
      address,
      price,
      description,
      provider,
    });

    return NextResponse.json({ success: true, hostel }, { status: 201 });
  } catch (error) {
    console.error("Error creating hostel:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// GET all hostels (optionally filter by provider)
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    let query = {};
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json(
          { success: false, message: "Invalid user ID" },
          { status: 400 }
        );
      }
      query.provider = new mongoose.Types.ObjectId(userId);
    }

    const hostels = await Hostel.find(query)
      .populate("provider", "name email image role")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, hostels, count: hostels.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching hostels:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
