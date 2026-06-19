import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";
import { ReportStat } from "../../types/reports";

interface Props {
  stats: ReportStat[];
}

export function ReportsStats({ stats }: Props) {
  const icons = [
    <DollarSign key={1} size={20} />,
    <ShoppingBag key={2} size={20} />,
    <Users key={3} size={20} />,
    <Package key={4} size={20} />,
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.title}
          className="rounded-[24px] border border-[#ead9dd] bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8f727a]">{stat.title}</p>

              <h3 className="mt-2 text-3xl font-semibold text-[#4b343a]">
                {stat.value.toLocaleString()}
              </h3>
            </div>

            <div className="rounded-2xl bg-[#f9eef1] p-3 text-[#b78895]">
              {icons[index]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
