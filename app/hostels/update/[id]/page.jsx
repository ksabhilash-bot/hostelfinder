"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderOne } from "@/components/ui/loader";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { use } from "react";
import { useUserStore } from "@/store/userStore";

export default function UpdateHostelPage({ params: paramsPromise }) {
  const { id: userID, role } = useUserStore();
  const params = use(paramsPromise); // Unwrap params using React.use
  const { id } = params;
  const [hostel, setHostel] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: {
      country: "",
      state: "",
      district: "",
      city: "",
      street: "",
      pincode: "",
    },
    price: "",
    description: "",
  });
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  async function fetchHostel() {
    try {
      const res = await fetch(`/api/hostels/fetchhostelbyid?id=${id}`);
      const data = await res.json();
      if (data.success) {
        setHostel(data.hostel);
        setFormData({
          name: data.hostel.name || "",
          address: {
            country: data.hostel.address?.country || "",
            state: data.hostel.address?.state || "",
            district: data.hostel.address?.district || "",
            city: data.hostel.address?.city || "",
            street: data.hostel.address?.street || "",
            pincode: data.hostel.address?.pincode || "",
          },
          price: data.hostel.price || "",
          description: data.hostel.description || "",
        });
      } else {
        toast.error(data.message || "Failed to fetch hostel");
        router.push("/404");
      }
    } catch (error) {
      toast.error("Error fetching hostel");
      console.error("Error fetching hostel:", error);
    }
  }

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      if (userID && role !== "hostelprovider") {
        toast.error("Signed Out");
        router.push("/");
      }
      if (!id) {
        toast.error("Invalid hostel ID or User Id");
        router.push("/404");
      } else {
        fetchHostel();
      }
    }
  }, [id, isHydrated, router, userID, role]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/hostels/fetchhostelbyid?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Hostel updated successfully");
        router.push(`/hostels/listhostels`);
      } else {
        toast.error(data.message || "Failed to update hostel");
      }
    } catch (error) {
      toast.error("Error updating hostel");
      console.error("Error updating hostel:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (hostel?.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (hostel?.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  if (!hostel) {
    return (
      <div className="min-h-screen bg-rose-50 p-4 sm:p-8">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/45">
          <LoaderOne />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Building2 className="h-8 w-8" /> Update Hostel: {hostel.name}
      </h1>

      {/* Image Carousel */}
      {hostel.images && hostel.images.length > 0 ? (
        <div className="relative mb-6">
          <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={hostel.images[currentImageIndex]?.url}
              alt={`Hostel image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          {hostel.images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80"
                onClick={handleNextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              <div className="flex justify-center mt-2 gap-2">
                {hostel.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentImageIndex
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="mb-6 text-center text-gray-500">
          No images available
        </div>
      )}

      {/* Update Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hostel Name */}
        <div>
          <Label htmlFor="name" className="text-lg">
            Hostel Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-1"
            placeholder="Enter hostel name"
          />
        </div>

        {/* Address Fields */}
        <div className="space-y-4 border p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Address</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address.country">Country</Label>
              <Input
                id="address.country"
                name="address.country"
                value={formData.address.country}
                onChange={handleInputChange}
                required
                placeholder="Enter country"
              />
            </div>
            <div>
              <Label htmlFor="address.state">State</Label>
              <Input
                id="address.state"
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                required
                placeholder="Enter state"
              />
            </div>
            <div>
              <Label htmlFor="address.district">District</Label>
              <Input
                id="address.district"
                name="address.district"
                value={formData.address.district}
                onChange={handleInputChange}
                required
                placeholder="Enter district"
              />
            </div>
            <div>
              <Label htmlFor="address.city">City</Label>
              <Input
                id="address.city"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                required
                placeholder="Enter city"
              />
            </div>
            <div>
              <Label htmlFor="address.street">Street</Label>
              <Input
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                required
                placeholder="Enter street"
              />
            </div>
            <div>
              <Label htmlFor="address.pincode">Pincode</Label>
              <Input
                id="address.pincode"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleInputChange}
                required
                placeholder="Enter pincode"
              />
            </div>
          </div>
        </div>

        {/* Price */}
        <div>
          <Label htmlFor="price" className="text-lg">
            Price (per month)
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            required
            className="mt-1"
            placeholder="Enter price"
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-lg">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter hostel description"
            rows={5}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/hostels/${id}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <LoaderOne /> : "Update Hostel"}
          </Button>
        </div>
      </form>
    </div>
  );
}
