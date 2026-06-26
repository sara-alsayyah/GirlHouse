export interface DashboardStat {
  title: string;
  value: number | string;
}

export interface SalesDataPoint {
  day: string;
  sales: number;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: number;
  name: string;
  image: string | null;
  price: number;
  stock: number;
  total_sold: number;
}

export interface RecentOrder {
  id: number;
  order_number: string;
  customer_email: string;
  items_count: number;
  total_price: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
}

export interface DashboardData {
  stats: DashboardStat[];
  salesData: SalesDataPoint[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
}
