export interface ReportStat {
  title: string;
  value: number;
}

export interface RevenueChartPoint {
  month: string;
  revenue: number;
}

export interface TopSellingProduct {
  id: number;
  name: string;
  total_sold: number;
  revenue: number;
}

export interface CategoryRevenue {
  category: string;
  revenue: number;
}

export interface ReportsData {
  stats: ReportStat[];

  revenueChart: RevenueChartPoint[];

  topProducts: TopSellingProduct[];

  categoryRevenue: CategoryRevenue[];
}
