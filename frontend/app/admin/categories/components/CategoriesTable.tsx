import { AdminCategory } from "../../types/categories";
import { CategoryProductsBadge } from "./CategoryProductsBadge";
import { CategoryActions } from "./CategoryActions";

interface Props {
  categories: AdminCategory[];
  onDeleteClick: (categoryId: number) => void;
  onEditClick: (category: AdminCategory) => void;
}

export function CategoriesTable({
  categories,
  onDeleteClick,
  onEditClick,
}: Props) {
  return (
    <div className="rounded-[28px] border border-[#ead9dd] bg-white p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f0e0e4]">
              <th className="px-4 py-4 text-left">ID</th>
              <th className="px-4 py-4 text-left">Name</th>
              <th className="px-4 py-4 text-left">Slug</th>
              <th className="px-4 py-4 text-left">Products</th>
              <th className="px-4 py-4 text-left">Created</th>
              <th className="px-4 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-[#f7ecef]">
                <td className="px-4 py-5">{category.id}</td>

                <td className="px-4 py-5 font-medium text-[#4b343a]">
                  {category.name}
                </td>

                <td className="px-4 py-5 text-[#8f727a]">{category.slug}</td>

                <td className="px-4 py-5">
                  <CategoryProductsBadge count={category.products_count} />
                </td>

                <td className="px-4 py-5">
                  {category.created_at
                    ? new Date(category.created_at).toLocaleDateString()
                    : "-"}
                </td>

                <td className="px-4 py-5">
                  <CategoryActions
                    onDelete={() => onDeleteClick(category.id)}
                    onEdit={() => onEditClick(category)}
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
