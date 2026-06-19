import { Package, AlertTriangle, XCircle, Layers3 } from "lucide-react";

import { ProductsStats as Stats } from "../../types/products";

interface Props {
  stats: Stats;
}

export function ProductsStats({ stats }: Props) {
  const cards = [
    {
      title: "Products",
      value: stats.total_products,
      icon: <Package size={20} />,
    },
    {
      title: "Low Stock",
      value: stats.low_stock_products,
      icon: <AlertTriangle size={20} />,
    },
    {
      title: "Out of Stock",
      value: stats.out_of_stock_products,
      icon: <XCircle size={20} />,
    },
    {
      title: "Categories",
      value: stats.categories_count,
      icon: <Layers3 size={20} />,
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
