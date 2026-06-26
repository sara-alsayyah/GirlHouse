"use client";

import { useEffect, useMemo, useState } from "react";

import { AdminContainer } from "../components/AdminContainer";

import { ReviewsStats } from "./components/ReviewsStats";
import { ReviewsFilters } from "./components/ReviewsFilters";
import { ReviewsTable } from "./components/ReviewsTable";
import {
  adminGetReviews,
  asArray,
  getApiErrorMessage,
  getReviewsStats,
  getStoredAccessToken,
} from "@/app/lib/api";
import type { AdminReview } from "../types/reviews";

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token) {
      setError("Please log in as an admin to view reviews.");
      setLoading(false);
      return;
    }

    adminGetReviews(token)
      .then((payload) => {
        setReviews(asArray(payload));
        setError("");
      })
      .catch((error) => setError(getApiErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        review.customer_email.toLowerCase().includes(search) ||
        review.product_name.toLowerCase().includes(search);

      const matchesRating =
        ratingFilter === "all" || review.rating === Number(ratingFilter);

      return matchesSearch && matchesRating;
    });
  }, [searchTerm, ratingFilter, reviews]);

  const reviewsStats = useMemo(() => getReviewsStats(reviews), [reviews]);

  return (
    <AdminContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-semibold text-[#4b343a]">Reviews</h1>

          <p className="mt-2 text-[#8f727a]">
            Monitor customer feedback and ratings
          </p>
        </div>

        <ReviewsStats stats={reviewsStats} />

        {error && (
          <div className="rounded-[18px] border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <ReviewsFilters
          searchTerm={searchTerm}
          ratingFilter={ratingFilter}
          onSearchChange={setSearchTerm}
          onRatingChange={setRatingFilter}
        />

        {loading ? (
          <div className="h-72 animate-pulse rounded-[28px] bg-white" />
        ) : (
          <ReviewsTable reviews={filteredReviews} />
        )}
      </div>
    </AdminContainer>
  );
}
