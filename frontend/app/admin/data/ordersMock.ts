import { AdminOrder, OrdersStats } from "../types/orders";

export const ordersStats: OrdersStats = {
  total_orders: 156,
  pending_orders: 14,
  shipped_orders: 32,
  delivered_orders: 110,
};

export const ordersMock: AdminOrder[] = [
  {
    id: 1025,
    customer_email: "sara@example.com",
    items_count: 2,
    total_price: 85,
    status: "delivered",
    payment_method: "card",
    created_at: "2024-05-18T10:30:00Z",
  },
  {
    id: 1026,
    customer_email: "noor@example.com",
    items_count: 1,
    total_price: 45,
    status: "paid",
    payment_method: "cod",
    created_at: "2024-05-18T10:30:00Z",
  },
  {
    id: 1027,
    customer_email: "lama@example.com",
    items_count: 3,
    total_price: 120,
    status: "shipped",
    payment_method: "bank",
    created_at: "2024-05-17T10:30:00Z",
  },
  {
    id: 1028,
    customer_email: "huda@example.com",
    items_count: 2,
    total_price: 60,
    status: "pending",
    payment_method: "card",
    created_at: "2024-05-17T10:30:00Z",
  },
];
