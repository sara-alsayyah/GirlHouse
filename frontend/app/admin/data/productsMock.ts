import { AdminProduct, ProductsStats } from "../types/products";

export const productsStats: ProductsStats = {
  total_products: 312,
  low_stock_products: 18,
  out_of_stock_products: 4,
  categories_count: 8,
};

export const productsMock: AdminProduct[] = [
  {
    id: 1,
    name: "Premium Abaya",
    category: "Women",
    price: 98,
    stock: 42,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    slug: "premium-abaya",
    created_at: "2024-05-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Rose Dress",
    category: "Women",
    price: 75,
    stock: 8,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
    slug: "rose-dress",
    created_at: "2024-05-16T10:30:00Z",
  },
  {
    id: 3,
    name: "Basic Hijab",
    category: "Hijabs",
    price: 15,
    stock: 0,
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    slug: "basic-hijab",
    created_at: "2024-05-17T10:30:00Z",
  },
];
