import { MessageSquare, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { ReviewsStats as Stats } from "../../types/reviews";

interface Props {
  stats: Stats;
}

export function ReviewsStats({ stats }: Props) {
  const cards = [
    {
      title: "Total Reviews",
      value: stats.total_reviews,
      icon: <MessageSquare size={20} />,
    },
    {
      title: "Average Rating",
      value: stats.average_rating,
      icon: <Star size={20} />,
    },
    {
      title: "5 Star Reviews",
      value: stats.five_star_reviews,
      icon: <ThumbsUp size={20} />,
    },
    {
      title: "1 Star Reviews",
      value: stats.one_star_reviews,
      icon: <ThumbsDown size={20} />,
    },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-[24px] border border-[#ead9dd] bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8f727a]">{card.title}</p>

              <h3 className="mt-2 text-3xl font-semibold text-[#4b343a]">
                {card.value}
              </h3>
            </div>

            <div className="rounded-2xl bg-[#f9eef1] p-3 text-[#b78895]">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
