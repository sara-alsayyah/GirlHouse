import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
}

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="rounded-[24px] border border-[#eedee2] bg-white p-6 shadow-[0_10px_35px_rgba(183,136,149,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(183,136,149,0.14)]">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f9eef1] text-[#b78895]">
          {icon}
        </div>

        <div className="flex-1">
          <p className="text-sm text-[#8f727a]">{title}</p>

          <h3 className="mt-1 text-4xl font-semibold text-[#4b343a]">
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
}
