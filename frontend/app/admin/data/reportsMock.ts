import { ReportsData } from "../types/reports";

export const reportsData: ReportsData = {
  stats: [
    {
      title: "Total Revenue",
      value: 84520,
    },
    {
      title: "Total Orders",
      value: 1234,
    },
    {
      title: "Customers",
      value: 458,
    },
    {
      title: "Products Sold",
      value: 3210,
    },
  ],

  revenueChart: [
    { month: "Jan", revenue: 4200 },
    { month: "Feb", revenue: 5800 },
    { month: "Mar", revenue: 7100 },
    { month: "Apr", revenue: 9400 },
    { month: "May", revenue: 11200 },
    { month: "Jun", revenue: 12500 },
    { month: "Jul", revenue: 14320 },
  ],

  topProducts: [
    {
      id: 1,
      name: "Premium Abaya",
      total_sold: 120,
      revenue: 11760,
    },
    {
      id: 2,
      name: "Rose Dress",
      total_sold: 98,
      revenue: 7350,
    },
    {
      id: 3,
      name: "Basic Hijab",
      total_sold: 75,
      revenue: 1125,
    },
  ],

  categoryRevenue: [
    {
      category: "Abayas",
      revenue: 25000,
    },
    {
      category: "Hijabs",
      revenue: 18000,
    },
    {
      category: "Dresses",
      revenue: 32000,
    },
    {
      category: "Accessories",
      revenue: 9520,
    },
  ],
};
