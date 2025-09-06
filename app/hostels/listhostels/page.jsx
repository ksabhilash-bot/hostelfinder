"use client";

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const MyHostelsPage = () => {
  const { id } = useUserStore(); // ✅ you store _id as id in zustand
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false); // Track store hydration
  const router = useRouter();

  useEffect(() => {
    // Mark hydration as complete after the initial render
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Only check for redirection after the store is hydrated
    if (isHydrated && !id) {
      router.push("/");
      return;
    }

    // Proceed with fetching only if id exists
    if (id) {
      const fetchMyHostels = async () => {
        try {
          const res = await fetch(`/api/hostels?id=${id}`);
          const data = await res.json();
          if (data.success) {
            setHostels(data.hostels);
          }
        } catch (error) {
          console.error("Error fetching hostels:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMyHostels();
    }
  }, [id, isHydrated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2 className="animate-spin w-6 h-6" />
        <span className="ml-2 text-rose-500">Loading your hostels...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">My Hostels</h1>

      {hostels.length === 0 ? (
        <p className="text-gray-500">You haven’t added any hostels yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hostels.map((hostel) => (
            <Card key={hostel._id} className="shadow-md">
              <CardContent className="p-4 space-y-2">
                <h2 className="text-lg font-semibold">{hostel.name}</h2>
                <p className="text-sm text-gray-600">
                  {hostel.address?.city}, {hostel.address?.state}
                </p>
                <p className="font-medium">₹{hostel.price}</p>
                <p className="text-gray-700 line-clamp-2">
                  {hostel.description}
                </p>

                {hostel.images?.length > 0 && (
                  <img
                    src={hostel.images[0]}
                    alt={hostel.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyHostelsPage;
