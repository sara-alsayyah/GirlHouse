import { DashboardData } from "../types/dashboard";

export const dashboardData: DashboardData = {
  stats: [
    {
      title: "Total Sales",
      value: "$12,458",
    },
    {
      title: "Orders",
      value: "156",
    },
    {
      title: "Customers",
      value: "2,345",
    },
    {
      title: "Products",
      value: "312",
    },
  ],

  salesData: [
    { day: "Mon", sales: 4200 },
    { day: "Tue", sales: 4800 },
    { day: "Wed", sales: 8700 },
    { day: "Thu", sales: 12100 },
    { day: "Fri", sales: 9800 },
    { day: "Sat", sales: 7900 },
    { day: "Sun", sales: 13400 },
  ],

  topProducts: [
    {
      id: 1,
      name: "Premium Abaya",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
      price: 98,
      stock: 42,
      total_sold: 120,
    },
    {
      id: 2,
      name: "Rose Dress",
      image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
      price: 75,
      stock: 20,
      total_sold: 98,
    },
    {
      id: 3,
      name: "Eid Collection",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
      price: 110,
      stock: 100,
      total_sold: 75,
    },
    {
      id: 4,
      name: "Basic Hijab",
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
      price: 15,
      stock: 56,
      total_sold: 60,
    },
  ],

  recentOrders: [
    {
      id: 1025,
      customer_email: "sara@example.com",
      items_count: 2,
      total_price: 85,
      status: "delivered",
      created_at: "2024-05-18T10:30:00Z",
    },
    {
      id: 1026,
      customer_email: "noor@example.com",
      items_count: 1,
      total_price: 45,
      status: "paid",
      created_at: "2024-05-18T10:30:00Z",
    },
    {
      id: 1027,
      customer_email: "lama@example.com",
      items_count: 3,
      total_price: 120,
      status: "shipped",
      created_at: "2024-05-17T10:30:00Z",
    },
    {
      id: 1028,
      customer_email: "huda@example.com",
      items_count: 2,
      total_price: 60,
      status: "delivered",
      created_at: "2024-05-18T10:30:00Z",
    },
    {
      id: 1029,
      customer_email: "reem@example.com",
      items_count: 1,
      total_price: 35,
      status: "pending",
      created_at: "2024-05-16T10:30:00Z",
    },
  ],
};
