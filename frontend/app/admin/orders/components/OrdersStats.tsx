import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import { OrdersStats as Stats } from "../../types/orders";

interface Props {
  stats: Stats;
}

export function OrdersStats({ stats }: Props) {
  const cards = [
    {
      title: "Total Orders",
      value: stats.total_orders,
      icon: <Package size={20} />,
    },
    {
      title: "Pending",
      value: stats.pending_orders,
      icon: <Clock size={20} />,
    },
    {
      title: "Shipped",
      value: stats.shipped_orders,
      icon: <Truck size={20} />,
    },
    {
      title: "Delivered",
      value: stats.delivered_orders,
      icon: <CheckCircle size={20} />,
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
