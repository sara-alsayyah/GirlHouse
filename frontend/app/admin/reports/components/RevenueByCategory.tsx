import { CategoryRevenue } from "../../types/reports";

interface Props {
  categories: CategoryRevenue[];
}

export function RevenueByCategory({ categories }: Props) {
  return (
    <div className="rounded-[28px] border border-[#ead9dd] bg-white p-6">
      <h3 className="mb-6 text-2xl font-semibold text-[#4b343a]">
        Revenue by Category
      </h3>

      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.category}
            className="flex items-center justify-between"
          >
            <span className="text-[#4b343a]">{category.category}</span>

            <span className="font-semibold text-[#4b343a]">
              ${category.revenue.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
