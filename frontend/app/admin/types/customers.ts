export interface AdminCustomer {
  id: number;
  email: string;
  phone: string | null;

  total_orders: number;
  total_spent: number;

  date_joined: string;

  is_staff: boolean;
  is_active: boolean;
}

export interface CustomersStats {
  total_customers: number;
  active_customers: number;
  admins: number;
  total_revenue: number;
}
