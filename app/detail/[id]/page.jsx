"use client";
import { useUserStore } from "@/store/userStore";
import React, { use, useEffect, useState } from "react";
import { LoaderOne } from "@/components/ui/loader";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star, Trash2, User, Calendar } from "lucide-react";

const page = ({ params: paramsPromise }) => {
  const { id: userId, user } = useUserStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const params = use(paramsPromise);
  const { id: hostelId } = params;
  const [hostel, setHostel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const router = useRouter();
  console.log(hostel);

  const [formData, setFormData] = useState({
    userId: "",
    hostelId: "",
    rating: 0,
    comment: "",
  });

  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!userId && isHydrated) {
      router.push("/");
    }
  }, [router, userId, isHydrated]);

  useEffect(() => {
    if (userId && hostelId && isHydrated) {
      setFormData((prev) => ({
        ...prev,
        userId,
        hostelId,
      }));
      fetchHostelById(hostelId);
      fetchReviews(hostelId);
    }
  }, [userId, hostelId, isHydrated]);

  const fetchHostelById = async (hostelId) => {
    try {
      const res = await fetch(`/api/hostels/fetchhostelbyid?id=${hostelId}`);
      const data = await res.json();
      if (res.ok) {
        setHostel(data.hostel);
      } else {
        toast.error(data.error || "Failed to fetch hostel");
      }
    } catch (error) {
      toast.error("Error fetching hostel details");
    }
  };

  const fetchReviews = async (hostelId) => {
    try {
      const res = await fetch(`/api/review?hostelId=${hostelId}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);
      } else {
        toast.error(data.error || "Failed to fetch reviews");
      }
    } catch (error) {
      toast.error("Error fetching reviews");
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (e) => {
    e.preventDefault();

    if (!formData.rating) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Review added successfully!");
        setFormData((prev) => ({
          ...prev,
          rating: 0,
          comment: "",
        }));
        fetchReviews(hostelId); // Refresh reviews
      } else {
        toast.error(data.error || "Failed to add review");
      }
    } catch (error) {
      toast.error("Error adding review");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (reviewId) => {
    setDeleting(reviewId);
    try {
      const res = await fetch(`/api/review`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId,
          userId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Review deleted successfully!");
        fetchReviews(hostelId); // Refresh reviews
      } else {
        toast.error(data.error || "Failed to delete review");
      }
    } catch (error) {
      toast.error("Error deleting review");
    } finally {
      setDeleting(null);
    }
  };

  const renderStars = (
    rating,
    interactive = false,
    onRate = null,
    onHover = null
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 ${
              star <= (interactive ? hoverRating || rating : rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform"
                : ""
            }`}
            onClick={interactive ? () => onRate(star) : undefined}
            onMouseEnter={interactive ? () => onHover(star) : undefined}
            onMouseLeave={interactive ? () => onHover(0) : undefined}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const userHasReviewed = reviews.some((review) => review.user._id === userId);

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderOne />
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hostel Header */}
        {hostel && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {hostel.name}
                </h1>
                <p className="text-gray-600 mt-1">{hostel.state}</p>
                <p className="text-gray-600 mt-1">{hostel.city}</p>
                <p className="text-gray-600 mt-1">{hostel.street}</p>
              </div>
              <div className="text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end gap-2 mb-1">
                  {renderStars(averageRating)}
                  <span className="text-lg font-semibold text-gray-900">
                    {averageRating}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Review Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {userHasReviewed
                  ? "You've already reviewed this hostel"
                  : "Add Your Review"}
              </h2>

              {!userHasReviewed ? (
                <form onSubmit={addReview} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    {renderStars(
                      formData.rating,
                      true,
                      (rating) => setFormData((prev) => ({ ...prev, rating })),
                      setHoverRating
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment (Optional)
                    </label>
                    <textarea
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Share your experience..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !formData.rating}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-green-600 fill-current" />
                  </div>
                  <p className="text-gray-600">
                    Thank you for your feedback! You can only review each hostel
                    once.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                All Reviews ({totalReviews})
              </h2>

              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-gray-600">
                    Be the first to review this hostel!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {review.user.image ? (
                              <img
                                src={review.user.image}
                                alt={review.user.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {review.user.name}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              {formatDate(review.createdAt)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {renderStars(review.rating)}
                          {review.user._id === userId && (
                            <button
                              onClick={() => deleteReview(review._id)}
                              disabled={deleting === review._id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete review"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {review.comment && (
                        <p className="text-gray-700 ml-13">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
