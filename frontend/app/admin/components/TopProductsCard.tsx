import { TopProduct } from "../types/dashboard";
import Link from "next/link";

interface TopProductsCardProps {
  products: TopProduct[];
}

export function TopProductsCard({ products }: TopProductsCardProps) {
  return (
    <div className="rounded-[28px] border border-[#ead9dd] bg-white p-6 shadow-[0_12px_40px_rgba(183,136,149,0.08)]">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-[#4b343a]">Top Products</h3>

        <Link
          href="/admin/products"
          className="text-sm font-medium text-[#b78895] hover:text-[#a56d7b]"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 rounded-2xl p-2 transition hover:bg-[#fcf7f8]"
          >
            <img
              src={product.image ?? "/placeholder.png"}
              alt={product.name}
              className="h-16 w-16 rounded-xl object-cover"
            />

            <div className="flex-1">
              <h4 className="font-medium text-[#4b343a]">{product.name}</h4>

              <p className="mt-1 font-semibold text-[#8f727a]">
                ${product.price}
              </p>
              <p className="text-xs text-[#8f727a]">Stock: {product.stock}</p>
            </div>

            <div className="text-right">
              <p className="font-semibold text-[#4b343a]">
                {product.total_sold}
              </p>

              <p className="text-sm text-[#8f727a]">sold</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
