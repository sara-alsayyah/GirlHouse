export interface DashboardStat {
  title: string;
  value: number;
}

export interface SalesDataPoint {
  label: string;
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
  customer_email: string;
  items_count: number;
  total_price: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  created_at: string;
}

export interface DashboardData {
  stats: DashboardStat[];
  salesData: SalesDataPoint[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
}
