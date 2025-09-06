"use client";

import { Hotel, Plus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
const EditProfilePage = () => {
  const router = useRouter();
  const { email, role, setUser, image, name, id } = useUserStore();

  const [selectedRole, setSelectedRole] = useState(role);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch user data from API and load into Zustand
  useEffect(() => {
    if (!id) {
      router.push("/");
    }
    const fetchUser = async () => {
      if (!email) return;

      setIsLoading(true);
      try {
        const res = await fetch(`/api/users?email=${email}`);
        const data = await res.json();

        if (data.success) {
          setUser({
            uid: data.user.uid,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            image: data.user.image,
          });
          setSelectedRole(data.user.role);
        }
      } catch (error) {
        setMessage("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [email, setUser, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return;

    setIsLoading(true);
    setMessage("");

    try {
      // Update role in DB
      const res = await fetch("/api/roleupdate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: selectedRole }),
      });

      const data = await res.json();
      if (data.success) {
        // Re-fetch updated user
        const userRes = await fetch(`/api/users?email=${email}`);
        const userData = await userRes.json();

        if (userData.success) {
          setUser({
            uid: userData.user.uid,
            name: userData.user.name,
            email: userData.user.email,
            role: userData.user.role,
            image: userData.user.image,
          });
          setMessage("Profile updated successfully!");
        }
      } else {
        setMessage("Failed to update profile");
      }
    } catch (error) {
      setMessage("An error occurred while updating");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Hostel Provider Quick Action */}
        {role === "hostelprovider" && (
          <div className="bg-white rounded-2xl shadow-lg border border-rose-100 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-400 to-pink-400 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    Hostel Management
                  </h3>
                  <p className="text-rose-100 text-sm">
                    Manage your property listings
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <Link href="/hostels/create">
                <Button className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium rounded-lg h-12 transition-all duration-200 transform hover:scale-[1.02]">
                  <Plus className="w-5 h-5 mr-2" />
                  Add or Update Your Hostel
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Main Profile Card */}
        <div
          id="profile-form"
          className="bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-500 to-rose-400 px-6 py-8 text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-20 h-20 border border-white/30 rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border border-white/20 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/10 rounded-full"></div>
            </div>

            <div className="relative z-10">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg overflow-hidden">
                  <Avatar className="w-full h-full">
                    <AvatarImage
                      src={image || "/default-avatar.png"}
                      alt={name || "Profile"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-white/90 text-rose-600 text-xl font-bold">
                      {email ? email[0].toUpperCase() : "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {/* Online status indicator */}
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white shadow-md"></div>
              </div>

              {name && (
                <h3 className="text-xl font-semibold text-white mb-1">
                  {name}
                </h3>
              )}
              <h2 className="text-2xl font-bold text-white mb-2">
                Edit Profile
              </h2>
              <p className="text-rose-100 text-sm">
                Update your account information
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {/* User Info Display */}
            {email && (
              <div className="mb-6 p-4 bg-rose-50 rounded-lg border border-rose-100">
                <div className="flex items-center gap-4">
                  {/* Small profile image */}
                  <div className="w-12 h-12 flex-shrink-0">
                    <Avatar className="w-full h-full border-2 border-rose-200">
                      <AvatarImage
                        src={image || "/default-avatar.png"}
                        alt={name || "Profile"}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-rose-200 text-rose-600 font-semibold">
                        {email ? email[0].toUpperCase() : "?"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-grow">
                    <p className="text-sm text-rose-600 font-medium mb-1">
                      Current Email
                    </p>
                    <p className="text-rose-800 font-semibold">{email}</p>
                    {name && (
                      <p className="text-rose-600 text-sm mt-1">{name}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <label
                  htmlFor="role"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Your Role
                </label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full h-12 border-2 border-rose-200 focus:border-rose-400 rounded-lg bg-white hover:border-rose-300 transition-colors">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="border-rose-200">
                    <SelectItem
                      value="normaluser"
                      className="hover:bg-rose-50 focus:bg-rose-50"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                        Normal User
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="hostelprovider"
                      className="hover:bg-rose-50 focus:bg-rose-50"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        Hostel Provider
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Message Display */}
              {message && (
                <div
                  className={`p-4 rounded-lg text-sm font-medium ${
                    message.includes("success")
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </div>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact support for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
