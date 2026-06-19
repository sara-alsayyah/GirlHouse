export interface StoreSettings {
  store_name: string;
  support_email: string;
  phone: string;
  address: string;
}

export interface ShippingSettings {
  free_shipping_threshold: number;
  standard_shipping_fee: number;
}

export interface PaymentSettings {
  cash_on_delivery: boolean;
  stripe_enabled: boolean;
}

export interface NotificationSettings {
  order_emails: boolean;
  review_notifications: boolean;
}

export interface SecuritySettings {
  two_factor_auth: boolean;
}

export interface AdminSettingsData {
  store: StoreSettings;
  shipping: ShippingSettings;
  payment: PaymentSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
}
