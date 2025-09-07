"use client";

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LoaderOne } from "@/components/ui/loader";

// Animation variants for cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.03, transition: { duration: 0.3 } },
};

// Animation variants for carousel items
const carouselItemVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const MyHostelsPage = () => {
  const { id, role } = useUserStore();
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const [loader, setLoader] = useState(false);

  // Function to fetch hostels
  const updatePage = (id) => {
    setLoader(true);
    router.push(`/hostels/update/${id}`);
  };

  const fetchMyHostels = async () => {
    try {
      setLoader(true);
      const res = await fetch(`/api/hostels?id=${id}`);
      const data = await res.json();
      if (data.success) {
        setHostels(data.hostels);
      } else {
        toast.error(data.message || "Failed to fetch hostels");
      }
    } catch (error) {
      console.error("Error fetching hostels:", error);
      toast.error("Failed to fetch hostels");
    } finally {
      setLoading(false);
      setLoader(false);
    }
  };

  useEffect(() => {
    // Whenever route changes, turn off loader
    setLoader(false);
  }, [router]);

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      setLoader(true);
      const response = await fetch(`/api/delete-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (response.ok) {
        // Update state by refetching hostels
        await fetchMyHostels();
        toast.success(data.message || "Hostel deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete hostel");
      }
    } catch (error) {
      console.error("Error deleting hostel:", error);
      toast.error("Failed to delete hostel");
    } finally {
      setDeleting(false);
      setLoader(false);
    }
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && (!id || role !== "hostelprovider")) {
      router.push("/");
      return;
    }

    if (id) {
      fetchMyHostels();
    }
  }, [id, isHydrated, router, role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-rose-50">
        <Loader2 className="animate-spin w-8 h-8 text-rose-500" />
        <span className="ml-3 text-rose-600 text-lg font-medium">
          Loading your hostels...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 p-4 sm:p-8">
      {loader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/45">
          <LoaderOne />
        </div>
      )}
      <motion.h1
        className="text-2xl sm:text-3xl font-bold text-rose-700 mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Hostels
      </motion.h1>

      {hostels.length === 0 ? (
        <motion.p
          className="text-rose-500 text-center text-base sm:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          You haven’t added any hostels yet.
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {hostels.map((hostel, index) => (
            <motion.div
              key={hostel._id}
              variants={cardVariants}
              className="block w-full sm:w-[90%] mx-auto"
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white shadow-lg border border-rose-200 hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-4 sm:p-5 space-y-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-rose-700">
                    {hostel.name}
                  </h2>
                  <p className="text-sm text-rose-500">
                    {hostel.address?.city}, {hostel.address?.state}
                  </p>
                  <p className="text-base sm:text-lg font-medium text-rose-600">
                    ₹{hostel.price}
                  </p>
                  <p className="text-rose-600 text-sm sm:text-base line-clamp-2">
                    {hostel.description}
                  </p>

                  {hostel.images?.length > 0 && (
                    <div className="relative">
                      <Carousel className="mt-4">
                        <CarouselContent>
                          {hostel.images.map((image, imgIndex) => (
                            <CarouselItem key={imgIndex}>
                              <motion.div
                                variants={carouselItemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: imgIndex * 0.2 }}
                              >
                                <img
                                  src={image?.url}
                                  alt={`Hostel image ${imgIndex + 1}`}
                                  className="w-full h-40 sm:h-48 object-cover rounded-md"
                                  onError={(e) => {
                                    e.currentTarget.src = "/fallback-image.jpg";
                                  }}
                                />
                              </motion.div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 px-2">
                          <CarouselPrevious className="bg-rose-100 text-rose-500 hover:bg-rose-200 h-8 w-8 rounded-full" />
                          <CarouselNext className="bg-rose-100 text-rose-500 hover:bg-rose-200 h-8 w-8 rounded-full" />
                        </div>
                      </Carousel>
                    </div>
                  )}
                </CardContent>
                <div className="flex flex-col sm:flex-row w-full gap-2 justify-around p-4">
                  <Button
                    className="w-full sm:w-auto hover:bg-black "
                    onClick={() => {
                      updatePage(hostel._id);
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    className="w-full sm:w-auto hover:bg-black"
                    onClick={() => handleDelete(hostel._id)}
                  >
                    {deleting ? "Deleting" : "Delete"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyHostelsPage;
