"use client";

import { useEffect, useState } from "react";
import { AdminContainer } from "../components/AdminContainer";

import { ReportsStats } from "./components/ReportsStats";
import { RevenueChart } from "./components/RevenueChart";
import { TopProductsReport } from "./components/TopProductsReport";
import { RevenueByCategory } from "./components/RevenueByCategory";
import { adminGetReports, getApiErrorMessage, getStoredAccessToken } from "@/app/lib/api";
import type { ReportsData } from "../types/reports";

export default function ReportsPage() {
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token) {
      setError("Please log in as an admin to view reports.");
      setLoading(false);
      return;
    }

    adminGetReports(token)
      .then((data) => {
        setReportsData(data);
        setError("");
      })
      .catch((error) => setError(getApiErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-semibold text-[#4b343a]">Reports</h1>

          <p className="mt-2 text-[#8f727a]">
            Sales analytics and business performance
          </p>
        </div>

        {error && (
          <div className="rounded-[18px] border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="h-32 animate-pulse rounded-[24px] bg-white" />
        ) : (
          <ReportsStats stats={reportsData?.stats ?? []} />
        )}

        <RevenueChart data={reportsData?.revenueChart ?? []} />

        <div className="grid gap-6 lg:grid-cols-2">
          <TopProductsReport products={reportsData?.topProducts ?? []} />

          <RevenueByCategory categories={reportsData?.categoryRevenue ?? []} />
        </div>
      </div>
    </AdminContainer>
  );
}
