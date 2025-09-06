import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files"); // multiple files

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files uploaded" },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());

      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "hostelfinder" }, (error, result) => {
            if (error) reject(error);
            else
              resolve({ url: result.secure_url, publicId: result.public_id });
          })
          .end(buffer);
      });
    });

    const images = await Promise.all(uploadPromises);

    const urls = images.map((img) => img.url);
    return NextResponse.json({ success: true, urls, images });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}
