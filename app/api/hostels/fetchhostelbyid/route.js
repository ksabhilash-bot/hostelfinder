import { NextResponse } from "next/server";
import mongoose from "mongoose";
import hostel from "@/models/hostel";
import { connectDB } from "@/lib/mongo";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "No hostel ID provided",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Invalid hostel ID",
      });
    }

    const refhostel = await hostel.findById(id);

    if (!refhostel) {
      return NextResponse.json({
        status: 404,
        message: "No hostel found",
        success: false,
      });
    }

    return NextResponse.json({
      hostel: refhostel,
      success: true,
      status: 200,
      message: "Found hostel",
    });
  } catch (error) {
    return NextResponse.json({
      message: error.message || "Error from database",
      status: 500,
      success: false,
    });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Invalid hostel ID",
      });
    }

    // Only allow updating specific fields
    const { name, address, price, description } = body;
    const updateData = { name, address, price, description };

    const updatedHostel = await hostel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedHostel) {
      return NextResponse.json({
        success: false,
        status: 404,
        message: "Hostel not found",
      });
    }

    return NextResponse.json({
      hostel: updatedHostel,
      success: true,
      status: 200,
      message: "Hostel updated successfully",
    });
  } catch (error) {
    return NextResponse.json({
      message: error.message || "Error updating hostel",
      status: 500,
      success: false,
    });
  }
}
