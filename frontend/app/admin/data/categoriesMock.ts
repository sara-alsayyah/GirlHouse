import { AdminCategory, CategoriesStats } from "../types/categories";

export const categoriesStats: CategoriesStats = {
  total_categories: 8,
  total_products: 312,
  largest_category_products: 92,
};

export const categoriesMock: AdminCategory[] = [
  {
    id: 1,
    name: "Abayas",
    slug: "abayas",
    products_count: 92,
    created_at: "2024-01-10",
  },
  {
    id: 2,
    name: "Hijabs",
    slug: "hijabs",
    products_count: 74,
    created_at: "2024-01-12",
  },
  {
    id: 3,
    name: "Dresses",
    slug: "dresses",
    products_count: 58,
    created_at: "2024-01-15",
  },
  {
    id: 4,
    name: "Accessories",
    slug: "accessories",
    products_count: 24,
    created_at: "2024-02-02",
  },
];
