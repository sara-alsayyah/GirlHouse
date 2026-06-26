export interface AdminOrder {
  id: number;
  order_number: string;
  customer_email: string;
  items_count: number;
  total_price: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_method: "cod" | "whish" | "card" | "bank";
  created_at: string;
}

export interface OrdersStats {
  total_orders: number;
  pending_orders: number;
  shipped_orders: number;
  delivered_orders: number;
}
