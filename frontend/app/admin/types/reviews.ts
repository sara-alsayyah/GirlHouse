export interface AdminReview {
  id: number;
  customer_email: string;
  product_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewsStats {
  total_reviews: number;
  average_rating: number;
  five_star_reviews: number;
  one_star_reviews: number;
}
