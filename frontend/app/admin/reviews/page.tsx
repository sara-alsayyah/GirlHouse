"use client";

import { useMemo, useState } from "react";

import { AdminContainer } from "../components/AdminContainer";

import { ReviewsStats } from "./components/ReviewsStats";
import { ReviewsFilters } from "./components/ReviewsFilters";
import { ReviewsTable } from "./components/ReviewsTable";

import { reviewsMock, reviewsStats } from "../data/reviewsMock";

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const filteredReviews = useMemo(() => {
    return reviewsMock.filter((review) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        review.customer_email.toLowerCase().includes(search) ||
        review.product_name.toLowerCase().includes(search);

      const matchesRating =
        ratingFilter === "all" || review.rating === Number(ratingFilter);

      return matchesSearch && matchesRating;
    });
  }, [searchTerm, ratingFilter]);

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

        <ReviewsFilters
          searchTerm={searchTerm}
          ratingFilter={ratingFilter}
          onSearchChange={setSearchTerm}
          onRatingChange={setRatingFilter}
        />

        <ReviewsTable reviews={filteredReviews} />
      </div>
    </AdminContainer>
  );
}
