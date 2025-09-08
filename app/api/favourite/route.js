// api/favorites/add/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Favorites from "@/models/favourite";
import User from "@/models/user";
import Hostel from "@/models/hostel";

export async function POST(request) {
  try {
    await connectDB();

    const { userId, hostelId } = await request.json();

    // Validate required fields
    if (!userId || !hostelId) {
      return NextResponse.json(
        { error: "User ID and Hostel ID are required" },
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

    // Check if user already has a favorites document
    let userFavorites = await Favorites.findOne({ user: userId });

    if (userFavorites) {
      // Check if hostel is already in favorites
      if (userFavorites.hostels.includes(hostelId)) {
        return NextResponse.json(
          { error: "Hostel is already in your favorites" },
          { status: 409 }
        );
      }

      // Add hostel to existing favorites
      userFavorites.hostels.push(hostelId);
      await userFavorites.save();
    } else {
      // Create new favorites document
      userFavorites = new Favorites({
        user: userId,
        hostels: [hostelId],
      });
      await userFavorites.save();
    }

    return NextResponse.json(
      {
        message: "Hostel added to favorites successfully",
        favorites: userFavorites,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    const { userId, hostelId } = await request.json();

    // Validate required fields
    if (!userId || !hostelId) {
      return NextResponse.json(
        { error: "User ID and Hostel ID are required" },
        { status: 400 }
      );
    }

    // Find user's favorites
    const userFavorites = await Favorites.findOne({ user: userId });

    if (!userFavorites) {
      return NextResponse.json(
        { error: "No favorites found for this user" },
        { status: 404 }
      );
    }

    // Check if hostel is in favorites
    const hostelIndex = userFavorites.hostels.indexOf(hostelId);
    if (hostelIndex === -1) {
      return NextResponse.json(
        { error: "Hostel is not in your favorites" },
        { status: 404 }
      );
    }

    // Remove hostel from favorites
    userFavorites.hostels.splice(hostelIndex, 1);

    // If no hostels left, you could optionally delete the entire document
    if (userFavorites.hostels.length === 0) {
      await Favorites.findByIdAndDelete(userFavorites._id);
      return NextResponse.json(
        {
          message:
            "Hostel removed from favorites. Favorites list is now empty.",
        },
        { status: 200 }
      );
    } else {
      await userFavorites.save();
    }

    return NextResponse.json(
      {
        message: "Hostel removed from favorites successfully",
        favorites: userFavorites,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user's favorites with populated hostel data
    const userFavorites = await Favorites.findOne({ user: userId }).populate({
      path: "hostels",
      populate: {
        path: "provider",
        select: "name email",
      },
    });

    if (!userFavorites) {
      return NextResponse.json({
        favorites: [],
        totalFavorites: 0,
      });
    }

    return NextResponse.json({
      favorites: userFavorites.hostels,
      totalFavorites: userFavorites.hostels.length,
      favoriteIds: userFavorites.hostels.map((hostel) => hostel._id),
    });
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
