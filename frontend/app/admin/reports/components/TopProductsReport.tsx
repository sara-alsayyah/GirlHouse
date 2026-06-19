import { TopSellingProduct } from "../../types/reports";

interface Props {
  products: TopSellingProduct[];
}

export function TopProductsReport({ products }: Props) {
  return (
    <div className="rounded-[28px] border border-[#ead9dd] bg-white p-6">
      <h3 className="mb-6 text-2xl font-semibold text-[#4b343a]">
        Best Selling Products
      </h3>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#4b343a]">{product.name}</p>

              <p className="text-sm text-[#8f727a]">
                {product.total_sold} sold
              </p>
            </div>

            <p className="font-semibold text-[#4b343a]">${product.revenue}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
