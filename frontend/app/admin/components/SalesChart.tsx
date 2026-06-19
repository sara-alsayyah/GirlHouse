"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SalesChartProps {
  data: {
    day: string;
    sales: number;
  }[];
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="rounded-[28px] border border-[#ead9dd] bg-white p-6 shadow-[0_12px_40px_rgba(183,136,149,0.08)]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-[#4b343a]">
            Sales Overview
          </h3>
        </div>

        <button className="rounded-xl border border-[#ecdde0] px-4 py-2 text-sm text-[#8f727a]">
          This Week
        </button>
      </div>

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d29cab" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#d29cab" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f3e6e8" />

            <XAxis
              dataKey="day"
              tick={{ fill: "#8f727a" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#8f727a" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="#c58a99"
              strokeWidth={3}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
