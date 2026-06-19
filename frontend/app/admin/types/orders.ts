export interface AdminOrder {
  id: number;
  customer_email: string;
  items_count: number;
  total_price: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  payment_method: "cod" | "card" | "bank";
  created_at: string;
}

export interface OrdersStats {
  total_orders: number;
  pending_orders: number;
  shipped_orders: number;
  delivered_orders: number;
}
