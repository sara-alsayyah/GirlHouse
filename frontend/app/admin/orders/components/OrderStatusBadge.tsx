interface Props {
  status: "pending" | "paid" | "shipped" | "delivered";
}

export function OrderStatusBadge({ status }: Props) {
  const styles = {
    pending: "bg-red-100 text-red-700",
    paid: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
