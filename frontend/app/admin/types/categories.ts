export interface AdminCategory {
  id: number;
  name: string;
  slug: string;

  products_count: number;

  created_at: string;
}

export interface CategoriesStats {
  total_categories: number;
  total_products: number;
  largest_category_products: number;
}
