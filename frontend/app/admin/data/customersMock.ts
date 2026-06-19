import { AdminCustomer, CustomersStats } from "../types/customers";

export const customersStats: CustomersStats = {
  total_customers: 245,
  active_customers: 228,
  admins: 3,
  total_revenue: 45680,
};

export const customersMock: AdminCustomer[] = [
  {
    id: 1,
    email: "sara@example.com",
    phone: "+96170111222",
    total_orders: 12,
    total_spent: 840,
    date_joined: "2024-01-05",
    is_staff: false,
    is_active: true,
  },
  {
    id: 2,
    email: "noor@example.com",
    phone: "+96170888999",
    total_orders: 5,
    total_spent: 220,
    date_joined: "2024-02-18",
    is_staff: false,
    is_active: true,
  },
  {
    id: 3,
    email: "admin@girlhouse.com",
    phone: null,
    total_orders: 0,
    total_spent: 0,
    date_joined: "2023-12-01",
    is_staff: true,
    is_active: true,
  },
  {
    id: 4,
    email: "reem@example.com",
    phone: "+96176333444",
    total_orders: 1,
    total_spent: 45,
    date_joined: "2024-05-10",
    is_staff: false,
    is_active: false,
  },
];
