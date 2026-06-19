import { AdminProduct } from "../../types/products";
import { ProductStockBadge } from "./ProductStockBadge";
import { ProductActions } from "./ProductActions";

interface Props {
  products: AdminProduct[];
  onDeleteClick: (productId: number) => void;
  onEditClick: (product: AdminProduct) => void;
}

export function ProductsTable({ products, onDeleteClick, onEditClick }: Props) {
  return (
    <div className="rounded-[28px] border border-[#ead9dd] bg-white p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f0e0e4]">
              <th className="px-4 py-4 text-left">Product</th>
              <th className="px-4 py-4 text-left">Category</th>
              <th className="px-4 py-4 text-left">Price</th>
              <th className="px-4 py-4 text-left">Stock</th>
              <th className="px-4 py-4 text-left">Status</th>
              <th className="px-4 py-4 text-left">Created</th>
              <th className="px-4 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-[#f7ecef]">
                <td className="px-4 py-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image ?? "/placeholder.png"}
                      alt={product.name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />

                    <div>
                      <p className="font-medium text-[#4b343a]">
                        {product.name}
                      </p>

                      <p className="text-xs text-[#8f727a]">#{product.id}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-5">{product.category}</td>

                <td className="px-4 py-5">${product.price}</td>

                <td className="px-4 py-5">{product.stock}</td>

                <td className="px-4 py-5">
                  <ProductStockBadge stock={product.stock} />
                </td>

                <td className="px-4 py-5">
                  {new Date(product.created_at).toLocaleDateString()}
                </td>

                <td className="px-4 py-5">
                  <ProductActions
                    onEdit={() => onEditClick(product)}
                    onDelete={() => onDeleteClick(product.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
