import { AdminOrder } from "../../types/orders";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderActions } from "./OrderActions";

interface Props {
  orders: AdminOrder[];
  onDeleteClick: (orderId: number) => void;
  onEditClick: (order: AdminOrder) => void;
}

export function OrdersTable({ orders, onDeleteClick, onEditClick }: Props) {
  return (
    <div className="rounded-[28px] border border-[#ead9dd] bg-white p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f0e0e4]">
              <th className="px-4 py-4 text-left">ID</th>
              <th className="px-4 py-4 text-left">Customer</th>
              <th className="px-4 py-4 text-left">Items</th>
              <th className="px-4 py-4 text-left">Total</th>
              <th className="px-4 py-4 text-left">Payment</th>
              <th className="px-4 py-4 text-left">Status</th>
              <th className="px-4 py-4 text-left">Date</th>
              <th className="px-4 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-[#f7ecef]">
                <td className="px-4 py-5">{order.id}</td>

                <td className="px-4 py-5">{order.customer_email}</td>

                <td className="px-4 py-5">{order.items_count}</td>

                <td className="px-4 py-5">${order.total_price}</td>

                <td className="px-4 py-5">{order.payment_method}</td>

                <td className="px-4 py-5">
                  <OrderStatusBadge status={order.status} />
                </td>

                <td className="px-4 py-5">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-5">
                  <OrderActions
                    onEdit={() => onEditClick(order)}
                    onDelete={() => onDeleteClick(order.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
