import { RecentOrder } from "../types/dashboard";

interface RecentOrdersTableProps {
  orders: RecentOrder[];
}

function getStatusStyles(status: string) {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-700";

    case "paid":
      return "bg-yellow-100 text-yellow-700";

    case "shipped":
      return "bg-blue-100 text-blue-700";

    case "pending":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <div className="rounded-[28px] border border-[#ead9dd] bg-white p-6 shadow-[0_12px_40px_rgba(183,136,149,0.08)]">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-[#4b343a]">Recent Orders</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f2e5e8]">
              <th className="px-4 py-4 text-left text-sm font-medium text-[#8f727a]">
                Order ID
              </th>

              <th className="px-4 py-4 text-left text-sm font-medium text-[#8f727a]">
                Customer
              </th>

              <th className="px-4 py-4 text-left text-sm font-medium text-[#8f727a]">
                Items
              </th>

              <th className="px-4 py-4 text-left text-sm font-medium text-[#8f727a]">
                Total
              </th>

              <th className="px-4 py-4 text-left text-sm font-medium text-[#8f727a]">
                Status
              </th>

              <th className="px-4 py-4 text-left text-sm font-medium text-[#8f727a]">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-[#f7ecef] transition hover:bg-[#fcf7f8]"
              >
                <td className="px-4 py-5 font-medium text-[#4b343a]">
                  #{order.id}
                </td>

                <td className="px-4 py-5 text-[#4b343a]">
                  {order.customer_email}
                </td>

                <td className="px-4 py-5 text-[#4b343a]">
                  {order.items_count}
                </td>

                <td className="px-4 py-5 font-medium text-[#4b343a]">
                  ${order.total_price}
                </td>

                <td className="px-4 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyles(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-4 py-5 text-[#8f727a]">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
