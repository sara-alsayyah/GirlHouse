import { Users, Shield, UserCheck, DollarSign } from "lucide-react";
import { CustomersStats as Stats } from "../../types/customers";

interface Props {
  stats: Stats;
}

export function CustomersStats({ stats }: Props) {
  const cards = [
    {
      title: "Customers",
      value: stats.total_customers,
      icon: <Users size={20} />,
    },
    {
      title: "Active",
      value: stats.active_customers,
      icon: <UserCheck size={20} />,
    },
    {
      title: "Admins",
      value: stats.admins,
      icon: <Shield size={20} />,
    },
    {
      title: "Revenue",
      value: `$${stats.total_revenue}`,
      icon: <DollarSign size={20} />,
    },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-[24px] border border-[#ead9dd] bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8f727a]">{card.title}</p>

              <h3 className="mt-2 text-3xl font-semibold text-[#4b343a]">
                {card.value}
              </h3>
            </div>

            <div className="rounded-2xl bg-[#f9eef1] p-3 text-[#b78895]">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
