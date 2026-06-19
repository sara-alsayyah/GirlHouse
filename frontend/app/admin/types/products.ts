export interface AdminProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string | null;
  slug: string;
  created_at: string;
}

export interface ProductsStats {
  total_products: number;
  low_stock_products: number;
  out_of_stock_products: number;
  categories_count: number;
}
