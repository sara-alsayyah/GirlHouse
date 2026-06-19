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

interface Props {
  data: {
    month: string;
    revenue: number;
  }[];
}

export function RevenueChart({ data }: Props) {
  return (
    <div className="rounded-[28px] border border-[#ead9dd] bg-white p-6">
      <h3 className="mb-6 text-2xl font-semibold text-[#4b343a]">
        Revenue Overview
      </h3>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d29cab" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#d29cab" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#f3e6e8" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#c58a99"
              fill="url(#revenueGradient)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
