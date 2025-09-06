import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "@/lib/mongo";
import Hostel from "@/models/hostel";
import mongoose from "mongoose";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { id } = await req.json();

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing required field: id" },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid hostel ID" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the hostel to get its images
    const hostel = await Hostel.findById(id);
    if (!hostel) {
      return NextResponse.json(
        { success: false, message: "Hostel not found" },
        { status: 404 }
      );
    }

    // Delete all images from Cloudinary
    if (hostel.images && hostel.images.length > 0) {
      const deletePromises = hostel.images.map((image) =>
        cloudinary.uploader.destroy(image.publicId, {
          invalidate: true,
          resource_type: "image",
        })
      );
      const cloudinaryResults = await Promise.all(deletePromises);

      // Check if any Cloudinary deletion failed
      const failedDeletions = cloudinaryResults.filter(
        (result) => result.result !== "ok" && result.result !== "not found"
      );
      if (failedDeletions.length > 0) {
        console.error("Cloudinary deletion errors:", failedDeletions);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to delete one or more images from Cloudinary",
          },
          { status: 500 }
        );
      }
    }

    // Delete the hostel from MongoDB
    const deleteResult = await Hostel.deleteOne({ _id: id });
    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Failed to delete hostel from database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Hostel and associated images deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting hostel:", error);
    return NextResponse.json(
      { success: false, message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
