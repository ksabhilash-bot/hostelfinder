"use client";
import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LoaderOne } from "@/components/ui/loader";

const Page = () => {
  const { id } = useUserStore();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [loadingFavorites, setLoadingFavorites] = useState({});
  const [after, setIsAfter] = useState(false);

  const detailed = (id) => {
    router.push(`/detail/${id}`);
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);
  useEffect(() => {
    if (!id && isHydrated) {
      router.push("/");
    }
  }, [id, isHydrated]);

  useEffect(() => {
    if (id && isHydrated) {
      fetchUserFavorites();
    }
  }, [id, isHydrated]);

  const fetchUserFavorites = async () => {
    try {
      setIsAfter(false);
      const response = await fetch(`/api/favourite?userId=${id}`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
        // Initialize image indexes for each favorite hostel
        const initialIndexes = {};
        data.favorites.forEach((hostel, index) => {
          initialIndexes[index] = 0;
        });
        setCurrentImageIndexes(initialIndexes);
      } else {
        toast.error("Failed to fetch favorites");
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Something went wrong");
    } finally {
      setIsAfter(true);
    }
  };

  const removeFavorite = async (hostelId) => {
    if (!id) {
      toast.error("Please login to manage favorites");
      return;
    }

    setLoadingFavorites((prev) => ({ ...prev, [hostelId]: true }));

    try {
      const response = await fetch("/api/favourite/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          hostelId: hostelId,
        }),
      });

      if (response.ok) {
        setFavorites((prev) =>
          prev.filter((hostel) => hostel._id !== hostelId)
        );
        toast.success("Removed from favorites");
      } else {
        const data = await response.json();
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Something went wrong");
    } finally {
      setLoadingFavorites((prev) => ({ ...prev, [hostelId]: false }));
    }
  };

  const navigateImages = (hostelIndex, direction) => {
    setCurrentImageIndexes((prev) => {
      const currentIndex = prev[hostelIndex];
      const imageCount = favorites[hostelIndex].images.length;

      let newIndex;
      if (direction === "next") {
        newIndex = (currentIndex + 1) % imageCount;
      } else {
        newIndex = (currentIndex - 1 + imageCount) % imageCount;
      }

      return {
        ...prev,
        [hostelIndex]: newIndex,
      };
    });
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <LoaderOne className="w-10 h-10 md:w-12 md:h-12 text-rose-600" />
      </div>
    );
  }

  if (!id) {
    return null; // Redirect handled in useEffect
  }

  if (isHydrated && favorites.length === 0 && after) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center px-4">
        <div className="text-center p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-rose-200 max-w-md w-full mx-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
            No Favorites Found
          </h2>
          <p className="text-gray-600 mb-5 md:mb-6 text-sm md:text-base">
            Add some hostels to your favorites to see them here!
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-sm md:text-base"
            size="sm"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
            Your Favorite Hostels
          </h1>
          <p className="text-sm md:text-lg text-gray-600">
            You have {favorites.length} favorite hostels
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          <AnimatePresence>
            {favorites.map((hostel, index) => {
              const isLoadingFavorite = loadingFavorites[hostel._id];

              return (
                <motion.div
                  key={hostel._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden border border-rose-200 hover:shadow-xl transition-all duration-300"
                >
                  {/* Image Carousel */}
                  <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
                    {hostel.images && hostel.images.length > 0 ? (
                      <>
                        <img
                          src={
                            hostel.images[currentImageIndexes[index] || 0]?.url
                          }
                          alt={hostel.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />

                        {/* Navigation Arrows */}
                        {hostel.images.length > 1 && (
                          <>
                            <button
                              onClick={() => navigateImages(index, "prev")}
                              className="absolute left-1 md:left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 md:p-1.5 shadow-md hover:bg-white transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-rose-600" />
                            </button>
                            <button
                              onClick={() => navigateImages(index, "next")}
                              className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 md:p-1.5 shadow-md hover:bg-white transition-colors"
                            >
                              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-rose-600" />
                            </button>
                          </>
                        )}

                        {/* Image Indicators */}
                        {hostel.images.length > 1 && (
                          <div className="absolute bottom-1 md:bottom-2 left-0 right-0 flex justify-center space-x-1 md:space-x-2">
                            {hostel.images.map((_, imgIndex) => (
                              <button
                                key={imgIndex}
                                onClick={() =>
                                  setCurrentImageIndexes({
                                    ...currentImageIndexes,
                                    [index]: imgIndex,
                                  })
                                }
                                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                                  (currentImageIndexes[index] || 0) === imgIndex
                                    ? "bg-rose-600"
                                    : "bg-white/80"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center">
                        <span className="text-rose-600 font-medium text-sm md:text-base">
                          No Image
                        </span>
                      </div>
                    )}

                    {/* Remove Favorite Button */}
                    <button
                      onClick={() => removeFavorite(hostel._id)}
                      disabled={isLoadingFavorite}
                      className={`absolute top-2 md:top-3 right-2 md:right-3 bg-white/90 rounded-full p-1.5 md:p-2 shadow-md hover:bg-white transition-all duration-200 ${
                        isLoadingFavorite ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoadingFavorite ? (
                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Heart className="w-4 h-4 md:w-5 md:h-5 text-rose-600 fill-rose-600" />
                      )}
                    </button>
                  </div>

                  {/* Hostel Details */}
                  <div className="p-4 md:p-6">
                    <div className="flex justify-between items-start mb-2 md:mb-3">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800 line-clamp-1">
                        {hostel.name}
                      </h3>
                    </div>

                    <div className="flex items-start text-gray-600 mb-3 md:mb-4">
                      <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2 mt-0.5 flex-shrink-0 text-rose-500" />
                      <div className="flex flex-col gap-1">
                        {hostel.address?.street && (
                          <span className="bg-rose-50 text-rose-700 px-2 py-0.5 md:py-1 rounded-full text-xs">
                            street: {hostel.address.street}
                          </span>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {hostel.address?.city && (
                            <span className="bg-rose-50 text-rose-700 px-2 py-0.5 md:py-1 rounded-full text-xs">
                              city: {hostel.address.city}
                            </span>
                          )}
                          {hostel.address?.district &&
                            hostel.address.district !== hostel.address.city && (
                              <span className="bg-rose-50 text-rose-700 px-2 py-0.5 md:py-1 rounded-full text-xs">
                                district: {hostel.address.district}
                              </span>
                            )}
                          {hostel.address?.state && (
                            <span className="bg-rose-50 text-rose-700 px-2 py-0.5 md:py-1 rounded-full text-xs">
                              state: {hostel.address.state}
                            </span>
                          )}
                          {hostel.address?.pincode && (
                            <span className="bg-rose-50 text-rose-700 px-2 py-0.5 md:py-1 rounded-full text-xs">
                              pincode: {hostel.address.pincode}
                            </span>
                          )}
                          {hostel.address?.country && (
                            <span className="bg-rose-50 text-rose-700 px-2 py-0.5 md:py-1 rounded-full text-xs">
                              country: {hostel.address.country}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">
                      {hostel.description ||
                        "Clean and comfortable hostel with great amenities."}
                    </p>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xl md:text-2xl font-bold text-rose-600">
                          ₹{hostel.price}
                        </span>
                        <span className="text-gray-500 text-xs md:text-sm">
                          /Month
                        </span>
                      </div>
                      <Button
                        onClick={() => detailed(hostel._id)}
                        className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-xs md:text-sm"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 md:mt-12 text-center"
        >
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="border-rose-300 text-rose-600 hover:bg-rose-50 text-sm md:text-base"
            size="sm"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Page;
