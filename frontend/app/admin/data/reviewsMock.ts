import { AdminReview, ReviewsStats } from "../types/reviews";

export const reviewsStats: ReviewsStats = {
  total_reviews: 245,
  average_rating: 4.6,
  five_star_reviews: 180,
  one_star_reviews: 8,
};

export const reviewsMock: AdminReview[] = [
  {
    id: 1,
    customer_email: "sara@example.com",
    product_name: "Premium Abaya",
    rating: 5,
    comment: "Amazing quality and fast delivery.",
    created_at: "2025-01-12T10:00:00Z",
  },
  {
    id: 2,
    customer_email: "noor@example.com",
    product_name: "Rose Dress",
    rating: 4,
    comment: "Beautiful dress but slightly large.",
    created_at: "2025-01-13T10:00:00Z",
  },
  {
    id: 3,
    customer_email: "lama@example.com",
    product_name: "Basic Hijab",
    rating: 5,
    comment: "Soft fabric and perfect color.",
    created_at: "2025-01-15T10:00:00Z",
  },
  {
    id: 4,
    customer_email: "reem@example.com",
    product_name: "Eid Collection",
    rating: 2,
    comment: "Expected better stitching.",
    created_at: "2025-01-18T10:00:00Z",
  },
];
