// api/reviews/add/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Review from "@/models/review";
import User from "@/models/user";
import Hostel from "@/models/hostel";

export async function POST(request) {
  try {
    await connectDB();

    const { userId, hostelId, rating, comment } = await request.json();

    // Validate required fields
    if (!userId || !hostelId || !rating) {
      return NextResponse.json(
        { error: "User ID, Hostel ID, and rating are required" },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if user and hostel exist
    const [user, hostel] = await Promise.all([
      User.findById(userId),
      Hostel.findById(hostelId),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!hostel) {
      return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
    }

    // Check if user has already reviewed this hostel
    const existingReview = await Review.findOne({
      user: userId,
      hostel: hostelId,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this hostel" },
        { status: 409 }
      );
    }

    // Create new review
    const newReview = new Review({
      user: userId,
      hostel: hostelId,
      rating,
      comment: comment || "",
    });

    await newReview.save();

    // Populate user data for response
    await newReview.populate("user", "name email image");

    return NextResponse.json(
      {
        message: "Review added successfully",
        review: newReview,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    const { reviewId, userId } = await request.json();

    // Validate required fields
    if (!reviewId || !userId) {
      return NextResponse.json(
        { error: "Review ID and User ID are required" },
        { status: 400 }
      );
    }

    // Find the review
    const review = await Review.findById(reviewId);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if the user owns this review
    if (review.user.toString() !== userId) {
      return NextResponse.json(
        { error: "You can only delete your own reviews" },
        { status: 403 }
      );
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const hostelId = url.searchParams.get("hostelId");

    if (!hostelId) {
      return NextResponse.json(
        { error: "Hostel ID is required" },
        { status: 400 }
      );
    }

    // Get all reviews for the hostel
    const reviews = await Review.find({ hostel: hostelId })
      .populate("user", "name email image")
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    return NextResponse.json({
      reviews,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error("Error fetching hostel reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
