export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
}

export interface AdminProduct {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  price: number;
  stock: number;
  image: string | null;
  slug: string;
  created_at: string;
  description?: string;
  low_stock?: boolean;
  is_in_stock?: boolean;
  average_rating?: number;
}

export interface ProductsStats {
  total_products: number;
  low_stock_products: number;
  out_of_stock_products: number;
  categories_count: number;
}

export type AdminUpdateProductPayload = {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: number;
  image?: string | null;
  is_active?: boolean;
  featured?: boolean;
};
export type AdminProductPayload = {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: number;
  image?: string;
};
