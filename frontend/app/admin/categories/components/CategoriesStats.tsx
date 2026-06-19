import { FolderTree, Package, TrendingUp } from "lucide-react";

import { CategoriesStats as Stats } from "../../types/categories";

interface Props {
  stats: Stats;
}

export function CategoriesStats({ stats }: Props) {
  const cards = [
    {
      title: "Categories",
      value: stats.total_categories,
      icon: <FolderTree size={20} />,
    },
    {
      title: "Products",
      value: stats.total_products,
      icon: <Package size={20} />,
    },
    {
      title: "Largest Category",
      value: stats.largest_category_products,
      icon: <TrendingUp size={20} />,
    },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-3">
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
