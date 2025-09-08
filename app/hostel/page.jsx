"use client";
import React, { useEffect, useState } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LoaderOne } from "@/components/ui/loader";

const Page = () => {
  const { searchResults } = useSearchStore();
  const { id } = useUserStore();
  const [hydrated, setIsHydrated] = useState(false);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [favorites, setFavorites] = useState([]); // Array of favorite hostel IDs
  const [loadingFavorites, setLoadingFavorites] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (!id && !searchResults) {
      router.push("/");
    }
  }, [id, hydrated, searchResults]);

  useEffect(() => {
    setIsHydrated(true);

    const initialIndexes = {};
    searchResults.forEach((hostel, index) => {
      initialIndexes[index] = 0;
    });
    setCurrentImageIndexes(initialIndexes);

    if (id) {
      fetchUserFavorites();
    }
  }, [id]);

  const fetchUserFavorites = async () => {
    try {
      const response = await fetch(`/api/favourite?userId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favoriteIds || []);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const toggleFavorite = async (hostelId) => {
    if (!id) {
      toast.error("Please login to add favorites");
      return;
    }

    setLoadingFavorites((prev) => ({ ...prev, [hostelId]: true }));

    try {
      const isFavorite = favorites.includes(hostelId);
      const method = isFavorite ? "DELETE" : "POST";

      const response = await fetch("/api/favourite/", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          hostelId: hostelId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isFavorite) {
          // Remove from favorites
          setFavorites((prev) => prev.filter((fav) => fav !== hostelId));
          c;
          toast.success("Removed from favorites");
        } else {
          // Add to favorites
          setFavorites((prev) => [...prev, hostelId]);
          toast.success("Added to favorites");
        }
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Something went wrong");
    } finally {
      setLoadingFavorites((prev) => ({ ...prev, [hostelId]: false }));
    }
  };

  const navigateImages = (hostelIndex, direction) => {
    setCurrentImageIndexes((prev) => {
      const currentIndex = prev[hostelIndex];
      const imageCount = searchResults[hostelIndex].images.length;

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

  const detailed = (id) => {
    router.push(`/detail/${id}`);
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <LoaderOne className="w-12 h-12 text-rose-600" />
      </div>
    );
  }

  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Results Found
          </h2>
          <p className="text-gray-600 mb-6">Try a different search query</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Search Results
          </h1>
          <p className="text-lg text-gray-600">
            We found {searchResults.length} hostels matching your search
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {searchResults.map((hostel, index) => {
              const isFavorite = favorites.includes(hostel._id);
              const isLoadingFavorite = loadingFavorites[hostel._id];

              return (
                <motion.div
                  key={hostel._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-rose-200 hover:shadow-xl transition-all duration-300"
                >
                  {/* Image Carousel */}
                  <div className="relative h-56 overflow-hidden">
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
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow-md hover:bg-white transition-colors"
                            >
                              <ChevronLeft className="w-5 h-5 text-rose-600" />
                            </button>
                            <button
                              onClick={() => navigateImages(index, "next")}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow-md hover:bg-white transition-colors"
                            >
                              <ChevronRight className="w-5 h-5 text-rose-600" />
                            </button>
                          </>
                        )}

                        {/* Image Indicators */}
                        {hostel.images.length > 1 && (
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
                            {hostel.images.map((_, imgIndex) => (
                              <button
                                key={imgIndex}
                                onClick={() =>
                                  setCurrentImageIndexes({
                                    ...currentImageIndexes,
                                    [index]: imgIndex,
                                  })
                                }
                                className={`w-2 h-2 rounded-full ${
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
                        <span className="text-rose-600 font-medium">
                          No Image
                        </span>
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(hostel._id)}
                      disabled={isLoadingFavorite}
                      className={`absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-all duration-200 ${
                        isLoadingFavorite ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoadingFavorite ? (
                        <div className="w-5 h-5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Heart
                          className={`w-5 h-5 transition-colors duration-200 ${
                            isFavorite
                              ? "text-rose-600 fill-rose-600"
                              : "text-rose-600 hover:fill-rose-600"
                          }`}
                        />
                      )}
                    </button>
                  </div>

                  {/* Hostel Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-800 truncate">
                        {hostel.name}
                      </h3>
                    </div>

                    <div className="flex items-start text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-rose-500" />
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1">
                        {hostel.address?.street && (
                          <span className="bg-rose-50 text-rose-700 px-2 py-1 rounded-full text-xs">
                            street: {hostel.address.street}
                          </span>
                        )}
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1">
                          {hostel.address?.city && (
                            <span className="bg-rose-50 text-rose-700 px-2 py-1 rounded-full text-xs">
                              city: {hostel.address.city}
                            </span>
                          )}
                          {hostel.address?.district &&
                            hostel.address.district !== hostel.address.city && (
                              <span className="bg-rose-50 text-rose-700 px-2 py-1 rounded-full text-xs">
                                district: {hostel.address.district}
                              </span>
                            )}
                          {hostel.address?.state && (
                            <span className="bg-rose-50 text-rose-700 px-2 py-1 rounded-full text-xs">
                              state: {hostel.address.state}
                            </span>
                          )}
                          {hostel.address?.pincode && (
                            <span className="bg-rose-50 text-rose-700 px-2 py-1 rounded-full text-xs">
                              pincode: {hostel.address.pincode}
                            </span>
                          )}
                          {hostel.address?.country && (
                            <span className="bg-rose-50 text-rose-700 px-2 py-1 rounded-full text-xs">
                              country: {hostel.address.country}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {hostel.description ||
                        "Clean and comfortable hostel with great amenities."}
                    </p>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-rose-600">
                          ₹{hostel.price}
                        </span>
                        <span className="text-gray-500 text-sm">/Month</span>
                      </div>
                      <Button
                        onClick={() => {
                          detailed(hostel._id);
                        }}
                        className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
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
          className="mt-12 text-center"
        >
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="border-rose-300 text-rose-600 hover:bg-rose-50"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Page;
