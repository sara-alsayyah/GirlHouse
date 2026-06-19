import { AdminReview } from "../../types/reviews";
import { RatingStars } from "./RatingStars";

interface Props {
  reviews: AdminReview[];
}

export function ReviewsTable({ reviews }: Props) {
  return (
    <div className="rounded-[28px] border border-[#ead9dd] bg-white p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f0e0e4]">
              <th className="px-4 py-4 text-left">Customer</th>
              <th className="px-4 py-4 text-left">Product</th>
              <th className="px-4 py-4 text-left">Rating</th>
              <th className="px-4 py-4 text-left">Comment</th>
              <th className="px-4 py-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-b border-[#f7ecef]">
                <td className="px-4 py-5">{review.customer_email}</td>

                <td className="px-4 py-5">{review.product_name}</td>

                <td className="px-4 py-5">
                  <RatingStars rating={review.rating} />
                </td>

                <td className="px-4 py-5 max-w-[350px]">{review.comment}</td>

                <td className="px-4 py-5">
                  {new Date(review.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
