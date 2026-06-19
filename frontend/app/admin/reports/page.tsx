import { AdminContainer } from "../components/AdminContainer";

import { ReportsStats } from "./components/ReportsStats";
import { RevenueChart } from "./components/RevenueChart";
import { TopProductsReport } from "./components/TopProductsReport";
import { RevenueByCategory } from "./components/RevenueByCategory";

import { reportsData } from "../data/reportsMock";

export default function ReportsPage() {
  return (
    <AdminContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-semibold text-[#4b343a]">Reports</h1>

          <p className="mt-2 text-[#8f727a]">
            Sales analytics and business performance
          </p>
        </div>

        <ReportsStats stats={reportsData.stats} />

        <RevenueChart data={reportsData.revenueChart} />

        <div className="grid gap-6 lg:grid-cols-2">
          <TopProductsReport products={reportsData.topProducts} />

          <RevenueByCategory categories={reportsData.categoryRevenue} />
        </div>
      </div>
    </AdminContainer>
  );
}
