import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Hostel from "@/models/hostel"; // Adjust path to your Hostel model
import User from "@/models/user";

export async function GET(request) {
  try {
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const district = searchParams.get("district");
    const name = searchParams.get("name");
    const q = searchParams.get("q");

    // Build query object
    const query = {};
    if (city) {
      query["address.city"] = { $regex: city, $options: "i" }; // Case-insensitive partial match
    }
    if (state) {
      query["address.state"] = { $regex: state, $options: "i" };
    }
    if (district) {
      query["address.district"] = { $regex: district, $options: "i" };
    }
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { "address.city": { $regex: q, $options: "i" } },
        { "address.district": { $regex: q, $options: "i" } },
        { "address.state": { $regex: q, $options: "i" } },
      ];
    }

    // If no query parameters provided, return message
    if (Object.keys(query).length === 0) {
      return NextResponse.json(
        {
          message:
            "Please provide a city, state, district, hostel name, or general query to search",
        },
        { status: 400 }
      );
    }

    // Query the Hostel collection
    const hostels = await Hostel.find(query)
      .populate("provider", "name email") // Populate provider details
      .lean(); // Convert to plain JavaScript objects for faster response

    // Check if no hostels are found
    if (hostels.length === 0) {
      return NextResponse.json(
        { message: "No hostels found for the specified location or name" },
        { status: 404 }
      );
    }

    return NextResponse.json({ hostels }, { status: 200 });
  } catch (error) {
    console.error("Error in hostel search:", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
