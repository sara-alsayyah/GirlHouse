import { DollarSign, Package, ShoppingBag, Users } from "lucide-react";

import { AdminContainer } from "./components/AdminContainer";
import { StatCard } from "./components/StatCard";
import { SalesChart } from "./components/SalesChart";
import { TopProductsCard } from "./components/TopProductsCard";
import { RecentOrdersTable } from "./components/RecentOrdersTable";

import { dashboardData } from "./data/dashboardMock";

export default function AdminDashboardPage() {
  const statIcons = [
    <DollarSign size={24} key="sales" />,
    <ShoppingBag size={24} key="orders" />,
    <Users size={24} key="customers" />,
    <Package size={24} key="products" />,
  ];

  return (
    <AdminContainer>
      <div className="space-y-8">
        {/* Banner */}
        <div
          className="relative overflow-hidden rounded-[30px] p-10 shadow-[0_20px_60px_rgba(183,136,149,0.15)]
  bg-[url('/background.jpeg')] bg-cover bg-center bg-no-repeat"
        >
          {/* Gradient overlay (left → right fade) */}
          <div
            className="absolute inset-0 rounded-[30px] 
    bg-gradient-to-r from-[#d4a2af] via-[#dcb5bd]/60 to-transparent"
          />

          <div className="relative max-w-lg">
            <p className="text-lg text-white/90">Welcome back,</p>

            <h1 className="mt-2 text-5xl font-semibold text-white">Admin ✨</h1>

            <p className="mt-4 text-white/80">
              Here's what's happening with your store today.
            </p>
          </div>
        </div> 

        {/* Overview Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-[#4b343a]">Overview</h2>

          <button className="rounded-xl border border-[#ead9dd] bg-white px-4 py-2 text-sm text-[#8f727a]">
            Today
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-5 lg:grid-cols-4">
          {dashboardData.stats.map((stat, index) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={statIcons[index]}
            />
          ))}
        </div>

        {/* Chart + Products */}
        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <SalesChart data={dashboardData.salesData} />

          <TopProductsCard products={dashboardData.topProducts} />
        </div>

        {/* Orders */}
        <RecentOrdersTable orders={dashboardData.recentOrders} />
      </div>
    </AdminContainer>
  );
}
