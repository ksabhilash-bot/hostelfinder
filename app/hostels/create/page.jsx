"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/userStore";
import { X, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderOne } from "@/components/ui/loader";

export default function CreateHostelPage() {
  const { id, role } = useUserStore();
  const router = useRouter();
  const [loader, setLoader] = useState(false);

  const [form, setForm] = useState({
    name: "",
    images: [],
    country: "",
    state: "",
    district: "",
    city: "",
    street: "",
    pincode: "",
    price: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Upload multiple images
  // ✅ Upload multiple images with proper error handling
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoader(true);
    setMessage("Uploading images...");
    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        // The API returns 'images' array with objects { url, publicId }
        const newImages = Array.isArray(data.images) ? data.images : [];

        if (newImages.length > 0) {
          // Store the full image objects (not just URLs) to match schema
          setForm({ ...form, images: [...form.images, ...newImages] });
          setMessage("Images uploaded successfully!");
        } else {
          setMessage("No valid image URLs returned");
        }
      } else {
        setMessage(data.message || "Image upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Error uploading images");
    } finally {
      setLoader(false);
    }
  };

  const removeImage = (index) => {
    const newImages = form.images.filter((_, i) => i !== index);
    setForm({ ...form, images: newImages });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      setMessage("Please log in to create a hostel");
      return;
    }

    setIsLoading(true);
    setLoader(true);
    setMessage("");

    try {
      const res = await fetch("/api/hostels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          images: form.images,
          address: {
            country: form.country,
            state: form.state,
            district: form.district,
            city: form.city,
            street: form.street,
            pincode: form.pincode,
          },
          price: Number(form.price),
          description: form.description,
          provider: id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Hostel created successfully!");
        toast("Added successfully");
        setTimeout(() => {
          router.push("/hostels/listhostels");
        }, 2000);
        setLoader(false);
      } else {
        setMessage(data.message || "Failed to create hostel");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while creating the hostel");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 to-white p-4">
      {/* Loader Overlay */}
      {loader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/45">
          <LoaderOne />
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-rose-500 to-rose-400 px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Add New Hostel
                </h1>
                <p className="text-rose-100">
                  Create a new property listing for your hostel
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <span className="text-rose-600">
                  Please upload all images first.
                </span>
              </div>
              <div className="space-y-6">
                <Label htmlFor="name">Hostel Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Images Section */}
              <div className="space-y-4">
                <Label>Upload Images</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
                <div className="flex gap-3 flex-wrap">
                  {form.images.map((img, index) => (
                    <div
                      key={index}
                      className="relative w-32 h-32 border rounded-lg overflow-hidden"
                    >
                      <img
                        src={typeof img === "string" ? img : img.url}
                        alt="hostel"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="country"
                  placeholder="Country"
                  value={form.country}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="district"
                  placeholder="District"
                  value={form.district}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="pincode"
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
              <Input
                name="street"
                placeholder="Street Address"
                value={form.street}
                onChange={handleChange}
                required
              />

              {/* Description */}
              <Textarea
                name="description"
                placeholder="Describe your hostel, amenities, etc."
                value={form.description}
                onChange={handleChange}
              />

              {/* Message */}
              {message && (
                <p
                  className={`text-sm ${
                    message.includes("success")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}

              {/* Submit */}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Creating..." : "Create Hostel"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
