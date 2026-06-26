interface Props {
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}

export function OrderStatusBadge({ status }: Props) {
  const styles = {
    pending: "bg-red-100 text-red-700",
    processing: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
